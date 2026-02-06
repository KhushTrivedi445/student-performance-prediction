import joblib
import pandas as pd
from app.schemas.prediction_schema import PredictionInput

# ===== Load model only once =====
MODEL_PATH = "app/ml/student_performance_model.pkl"
model = joblib.load(MODEL_PATH)


def predict_marks(data: PredictionInput) -> float:
    """
    Takes validated PredictionInput
    Returns predicted G3 marks
    """

    # Convert input to DataFrame
    input_df = pd.DataFrame([data.dict()])

    # Predict
    prediction = model.predict(input_df)[0]

    return round(float(prediction), 2)
