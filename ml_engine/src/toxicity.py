import os
import joblib
from scipy.sparse import csr_matrix, hstack
import features

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "jailbreak_classifier.pkl")
_artifact = None

def load_model():
    global _artifact
    if _artifact is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"No model at {MODEL_PATH}")
        _artifact = joblib.load(MODEL_PATH)
    return _artifact

def toxicity_score(text: str) -> dict:
    """Score output text for toxicity/harmful content."""
    artifact = load_model()
    X = hstack([
        artifact["word_tfidf"].transform([text]),
        artifact["char_tfidf"].transform([text]),
        csr_matrix(artifact["scaler"].transform(features.extra_features([text]))),
    ])
    
    score = artifact["model"].predict_proba(X)[0, 1]
    threshold = artifact.get("threshold", 0.5)
    matched = features.which_patterns(text)
    
    if score >= 0.8:
        risk_level = "high"
    elif score >= 0.5:
        risk_level = "medium"
    else:
        risk_level = "low"
    
    return {
        "is_toxic": bool(score >= threshold),
        "toxicity_score": float(score),
        "confidence": float(min(score, 1.0 - score) * 2),
        "risk_level": risk_level,
        "toxic_patterns": matched,
    }

def set_toxicity_threshold(threshold: float):
    """Set custom toxicity threshold for output validation."""
    artifact = load_model()
    artifact["toxicity_threshold"] = threshold
    joblib.dump(artifact, MODEL_PATH)
    return f"Toxicity threshold updated to {threshold}"