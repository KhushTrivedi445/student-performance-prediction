import pandas as pd

MODEL_COLUMNS = [
    'sex','age','address','famsize','pstatus',
    'medu','fedu','mjob','fjob','reason','guardian',
    'traveltime','studytime','failures',
    'schoolsup','famsup','paid','activities','nursery',
    'higher','internet','romantic',
    'famrel','freetime','goout','dalc','walc','health',
    'absences','G1','G2'
]

def prepare_input(data: dict) -> pd.DataFrame:
    df = pd.DataFrame([data])
    df = df[MODEL_COLUMNS]  # ORDER LOCK
    return df
