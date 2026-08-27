import pandas as pd
from loguru import logger
from sklearn.preprocessing import MinMaxScaler

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    logger.info("Starting feature engineering...")
    
    # Identify target column
    target_col = "default"

    # Fill missing values if any
    df = df.fillna(method="ffill").fillna(method="bfill")

    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
    
    if target_col in numeric_cols:
        numeric_cols.remove(target_col)
    if target_col in categorical_cols:
        categorical_cols.remove(target_col)

    # One-hot encode categorical features
    if categorical_cols:
        df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
    
    import re
    # Sanitize column names for XGBoost and LightGBM (remove special characters)
    df.columns = [re.sub(r'[^a-zA-Z0-9_]', '_', col) for col in df.columns]

    # Min-Max scaling for numeric columns
    scaler = MinMaxScaler()
    if numeric_cols:
        # Some column names might have changed, so we re-fetch them
        current_numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        if target_col in current_numeric_cols:
            current_numeric_cols.remove(target_col)
        df[current_numeric_cols] = scaler.fit_transform(df[current_numeric_cols])
        
        import os
        import joblib
        os.makedirs("models", exist_ok=True)
        joblib.dump(scaler, "models/scaler.pkl")
        joblib.dump(current_numeric_cols, "models/numeric_cols.pkl")

    logger.info("Feature engineering completed.")
    return df

def preprocess_for_inference(user_data: dict) -> pd.DataFrame:
    import joblib
    import os
    import re
    df = pd.DataFrame([user_data])
    
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    if categorical_cols:
        df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
        
    df.columns = [re.sub(r'[^a-zA-Z0-9_]', '_', col) for col in df.columns]

    expected_features = joblib.load("models/features.pkl")

    for col in expected_features:
        if col not in df.columns:
            df[col] = 0

    df = df[expected_features]

    if os.path.exists("models/scaler.pkl") and os.path.exists("models/numeric_cols.pkl"):
        scaler = joblib.load("models/scaler.pkl")
        numeric_cols = joblib.load("models/numeric_cols.pkl")
        # Ensure we only scale columns that were numeric during training
        cols_to_scale = [c for c in numeric_cols if c in df.columns]
        if cols_to_scale:
            df[cols_to_scale] = scaler.transform(df[cols_to_scale])

    return df

