import joblib
import features
from scipy.sparse import hstack, csr_matrix

# Load saved model only once
saved = joblib.load("../models/jailbreak_classifier.pkl")

model = saved["model"]
word_tfidf = saved["word_tfidf"]
char_tfidf = saved["char_tfidf"]
scaler = saved["scaler"]


def predict(prompt):
    """
    Predict whether a prompt is Safe or Malicious.

    Args:
        prompt (str): Input prompt.

    Returns:
        int: 0 = Safe, 1 = Malicious
    """

    X = hstack([
        word_tfidf.transform([prompt]),
        char_tfidf.transform([prompt]),
        csr_matrix(scaler.transform(features.extra_features([prompt])))
    ])

    prediction = model.predict(X)[0]
    return int(prediction)


# Run only if this file is executed directly
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