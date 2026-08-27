import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score,
    confusion_matrix, ConfusionMatrixDisplay, RocCurveDisplay, PrecisionRecallDisplay
)
from loguru import logger

def evaluate_model(y_true, y_pred, y_proba=None, model_name="Model"):
    logger.info(f"Evaluating {model_name}...")

    print(f"{model_name} Accuracy: {accuracy_score(y_true, y_pred):.2f}")
    print(f"{model_name} Precision: {precision_score(y_true, y_pred):.2f}")
    print(f"{model_name} Recall: {recall_score(y_true, y_pred):.2f}")
    print(f"{model_name} F1 Score: {f1_score(y_true, y_pred):.2f}")

    if y_proba is not None:
        print(f"{model_name} ROC AUC: {roc_auc_score(y_true, y_proba):.2f}")
        RocCurveDisplay.from_predictions(y_true, y_proba).plot()
        PrecisionRecallDisplay.from_predictions(y_true, y_proba).plot()

    cm = confusion_matrix(y_true, y_pred)
    ConfusionMatrixDisplay(confusion_matrix=cm).plot()

    plt.suptitle(f"{model_name} Evaluation")
    plt.tight_layout()
    plt.show()

