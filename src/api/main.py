from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
from src.feature_engineering.features import preprocess_for_inference

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CreditData(BaseModel):
    account_check_status: str
    duration_in_month: int
    credit_history: str
    purpose: str
    credit_amount: int
    savings: str
    present_emp_since: str
    installment_as_income_perc: int
    personal_status_sex: str

@app.on_event("startup")
def load_model():
    global model
    model = joblib.load("models/log_model.pkl")

@app.post("/predict")
def predict_credit(data: CreditData):
    user_dict = data.dict()
    df_features = preprocess_for_inference(user_dict)
    
    prob = model.predict_proba(df_features)[0][1]
    pred_class = model.predict(df_features)[0]
    
    return {
        "probability_of_default": float(prob),
        "prediction_class": int(pred_class)
    }
