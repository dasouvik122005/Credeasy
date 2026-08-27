import pandas as pd
from src.feature_engineering.features import engineer_features

def test_engineer_features():
    df = pd.DataFrame({
        "credit_amount": [1000, 2000],
        "account_check_status": ["< 0 DM", "no checking account"],
        "default": [0, 1]
    })
    df = engineer_features(df)
    # Check that special characters were removed in column names
    assert not any("<" in col for col in df.columns)
    # Check that credit amount is scaled
    assert df["credit_amount"].max() <= 1.0

