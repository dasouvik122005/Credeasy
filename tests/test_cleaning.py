import pandas as pd
from src.preprocessing.cleaning import clean_data

def test_clean_data():
    df = pd.DataFrame({
        "Name ": ["Ali", "Sara", None, "Ali"],
        "Age": [25, 30, 22, 25]
    })
    cleaned = clean_data(df)
    assert cleaned.shape[0] == 2
    assert "name" in cleaned.columns


