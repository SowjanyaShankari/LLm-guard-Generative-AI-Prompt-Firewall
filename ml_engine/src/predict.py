import os
import joblib
from scipy.sparse import csr_matrix, hstack
import features

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "jailbreak_classifier.pkl"
)

_artifact = None


def load_model():
    global _artifact

    if _artifact is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"No model at {MODEL_PATH} - run train.py first"
            )

        _artifact = joblib.load(MODEL_PATH)

    return _artifact


def predict(text: str) -> int:
    """Returns 1 if jailbreak, 0 if safe."""

    text = str(text)
    artifact = load_model()

    X = hstack([
        artifact["word_tfidf"].transform([text]),
        artifact["char_tfidf"].transform([text]),
        csr_matrix(
            artifact["scaler"].transform(
                features.extra_features([text])
            )
        ),
    ])

    score = artifact["model"].predict_proba(X)[0, 1]

    return int(score >= artifact["threshold"])


def predict_with_confidence(text: str) -> dict:
    """Return prediction, confidence, matched patterns and detection type."""

    text = str(text)
    artifact = load_model()

    X = hstack([
        artifact["word_tfidf"].transform([text]),
        artifact["char_tfidf"].transform([text]),
        csr_matrix(
            artifact["scaler"].transform(
                features.extra_features([text])
            )
        ),
    ])

    score = artifact["model"].predict_proba(X)[0, 1]
    matched = features.which_patterns(text)
    is_jailbreak = score >= artifact["threshold"]

    return {
        "is_jailbreak": bool(is_jailbreak),
        "confidence": float(score),
        "matched_keywords": matched,
        "detection_type": (
            matched[0] if matched
            else ("ml" if is_jailbreak else "none")
        ),
    }
if __name__ == "__main__":
    print("=== Jailbreak Detection System ===")
    print("Type 'exit' to stop.\n")

    while True:
        prompt = input("Enter Prompt: ")

        if prompt.lower() == "exit":
            break

        result = predict(prompt)

        print("\nPrediction:", result)

        if result == 1:
            print("Malicious Prompt\n")
        else:
            print("Safe Prompt\n")