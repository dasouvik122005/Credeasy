import pandas as pd
from loguru import logger

def load_dataset(path: str) -> pd.DataFrame:
    logger.info(f"Loading dataset from {path}")
    df = pd.read_csv(path)
    logger.info(f"Loaded {df.shape[0]} rows and {df.shape[1]} columns")
    return df

