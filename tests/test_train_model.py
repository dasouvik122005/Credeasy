import pandas as pd
from src.models.train_model import train_models

def test_train_models():
    df = pd.DataFrame({
        "credit_amount": [0.2, 0.5, 0.9, 0.1, 0.6],
        "account_check_status_no checking account": [1, 0, 1, 0, 1],
        "default": [0, 1, 0, 0, 1]
    })
    train_models(df)

