import pandas as pd
from loguru import logger
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.linear_model import LogisticRegression
import xgboost as xgb
import lightgbm as lgb

def train_models(df: pd.DataFrame):
    logger.info("Starting model training...")

    X = df.drop(columns=["default"])
    y = df["default"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Logistic Regression
    log_model = LogisticRegression()
    log_model.fit(X_train, y_train)
    log_preds = log_model.predict(X_test)
    logger.info("Logistic Regression Results:")
    print(classification_report(y_test, log_preds))

    # Save model and features for inference
    import os
    import joblib
    os.makedirs("models", exist_ok=True)
    joblib.dump(log_model, "models/log_model.pkl")
    joblib.dump(X_train.columns.tolist(), "models/features.pkl")
    logger.info("Saved Logistic Regression model and features to models/")

    # XGBoost
    xgb_model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss')
    xgb_model.fit(X_train, y_train)
    xgb_preds = xgb_model.predict(X_test)
    logger.info("XGBoost Results:")
    print(classification_report(y_test, xgb_preds))

    # LightGBM
    lgb_model = lgb.LGBMClassifier()
    lgb_model.fit(X_train, y_train)
    lgb_preds = lgb_model.predict(X_test)
    logger.info("LightGBM Results:")
    print(classification_report(y_test, lgb_preds))

    logger.info("Model training completed.")

