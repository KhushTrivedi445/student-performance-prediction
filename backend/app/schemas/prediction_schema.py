from pydantic import BaseModel
from typing import Dict, Any

class PredictionInput(BaseModel):
    sex: str
    age: int
    address: str
    famsize: str
    pstatus: str

    medu: int
    fedu: int
    mjob: str
    fjob: str
    guardian: str
    famrel: int
    famsup: str

    reason: str
    traveltime: int
    studytime: int
    failures: int
    schoolsup: str
    paid: str

    activities: str
    nursery: str
    higher: str
    internet: str
    romantic: str
    freetime: int
    goout: int
    dalc: int
    walc: int
    health: int

    absences: int
    G1: int
    G2: int

class PredictionSaveRequest(BaseModel):
    formData: PredictionInput
    predictedMarks: float
    status: str
