import pandas as pd
from loguru import logger

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    logger.info("Starting data cleaning...")
    df = df.dropna()
    df = df.drop_duplicates()
    df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]
    logger.info("Data cleaning completed.")
    return df

