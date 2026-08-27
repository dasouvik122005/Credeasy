from src.evaluation.evaluate import evaluate_model

def test_evaluate_model():
    y_true = [0, 1, 0, 1, 1]
    y_pred = [0, 1, 0, 0, 1]
    y_proba = [0.1, 0.9, 0.2, 0.4, 0.8]
    evaluate_model(y_true, y_pred, y_proba, model_name="TestModel")

