import sys
from loguru import logger
from src.preprocessing.load_data import load_dataset
from src.preprocessing.cleaning import clean_data
from src.feature_engineering.features import engineer_features
from src.models.train_model import train_models

def main():
    logger.info("Starting AltCreditScoreAI Pipeline")
    
    # 1. Load Data
    df = load_dataset("data/alt_credit_data.csv")
    
    # 2. Clean Data
    df = clean_data(df)
    
    # 3. Engineer Features
    df = engineer_features(df)
    
    # 4. Train Models
    train_models(df)
    
    logger.info("Pipeline executed successfully.")

if __name__ == "__main__":
    main()
