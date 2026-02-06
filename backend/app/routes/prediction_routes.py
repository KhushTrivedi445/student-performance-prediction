from fastapi import APIRouter
from app.schemas.prediction_schema import PredictionInput, PredictionSaveRequest
from app.services.prediction_service import predict_marks
from app.core.database import db
from datetime import datetime

router = APIRouter()


@router.post("/predict")
def predict(data: PredictionInput):
    prediction = predict_marks(data)

    return {
        "predicted_marks": prediction
    }

@router.post("/save-prediction/{user_id}")
async def save_prediction(user_id: str, data: PredictionSaveRequest):
    prediction_dict = {
        "user_id": user_id,
        "date": datetime.now().isoformat(),
        "predictedMarks": data.predictedMarks,
        "status": data.status,
        "formData": data.formData.dict()
    }
    
    result = await db.predictions.insert_one(prediction_dict)
    
    return {
        "id": str(result.inserted_id),
        "message": "Prediction saved successfully"
    }

@router.get("/get-predictions/{user_id}")
async def get_predictions(user_id: str):
    predictions = await db.predictions.find({"user_id": user_id}).to_list(length=100)
    
    # ensure ObjectId is converted to string for frontend
    for p in predictions:
        p["id"] = str(p["_id"])
        del p["_id"]
        
    return predictions
