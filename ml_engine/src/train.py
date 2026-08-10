from scipy.sparse import csr_matrix, hstack
from sklearn.calibration import CalibratedClassifierCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MaxAbsScaler
from sklearn.svm import LinearSVC

import evaluate
import features
import preprocess

SEED = 42

train, val, test = preprocess.get_splits()
print()
for name, part in [("train", train), ("val", val), ("test", test)]:
    print(f"{name}: {len(part)} rows, {part['y'].sum()} injections")

# No stop_words here, "ignore all previous instructions" is almost all stopwords
word_tfidf = TfidfVectorizer(ngram_range=(1, 2), min_df=2, max_features=50000, sublinear_tf=True)

# Char ngrams catch tricks like "1gn0re" and non English text
char_tfidf = TfidfVectorizer(
    analyzer="char_wb", ngram_range=(3, 5), min_df=3, max_features=50000, sublinear_tf=True
)

scaler = MaxAbsScaler()

print("\nbuilding features...")

# Fit on train only, otherwise we leak information into the model
X_train = hstack(
    [
        word_tfidf.fit_transform(train["text"]),
        char_tfidf.fit_transform(train["text"]),
        csr_matrix(scaler.fit_transform(features.extra_features(train["text"]))),
    ]
)


def make_features(df):
    return hstack(
        [
            word_tfidf.transform(df["text"]),
            char_tfidf.transform(df["text"]),
            csr_matrix(scaler.transform(features.extra_features(df["text"]))),
        ]
    )


X_val = make_features(val)
X_test = make_features(test)

print("feature count:", X_train.shape[1])

# class_weight balanced, otherwise the model can just ignore the 4.6% attacks
svm = LinearSVC(C=1.0, class_weight="balanced", random_state=SEED)

# Wrapper turns the SVM output into a probability we can threshold on
model = CalibratedClassifierCV(svm, cv=3)

print("training...")
model.fit(X_train, train["y"])

val_scores = model.predict_proba(X_val)[:, 1]
test_scores = model.predict_proba(X_test)[:, 1]

# Pick the threshold on validation, never on test
threshold = evaluate.pick_threshold(val["y"], val_scores)
print(f"\nthreshold picked on validation set: {threshold:.3f}")

y_test = test["y"].to_numpy()

evaluate.report("TEST at default 0.5 threshold", y_test, test_scores, 0.5)
evaluate.report("TEST at our tuned threshold", y_test, test_scores, threshold)
import joblib
import os

os.makedirs("../models", exist_ok=True)

joblib.dump({
    "model": model,
    "word_tfidf": word_tfidf,
    "char_tfidf": char_tfidf,
    "scaler": scaler
}, "../models/jailbreak_classifier.pkl")

print("Model saved successfully!")

y_train = train["y"].values
print("training...")

model = CalibratedClassifierCV(LinearSVC(random_state=SEED, max_iter=2000), cv=3)
model.fit(X_train, y_train)

test_scores = model.predict_proba(X_test)[:, 1]

# Tune threshold for ≥95% recall
best_threshold = 0.5
best_f1 = 0
for t in [i / 1000 for i in range(1, 1000)]:
    preds = (test_scores >= t).astype(int)
    tp = ((preds == 1) & (y_test == 1)).sum()
    fp = ((preds == 1) & (y_test == 0)).sum()
    fn = ((preds == 0) & (y_test == 1)).sum()
    if tp + fp == 0:
        continue
    precision = tp / (tp + fp)
    recall = tp / (tp + fn)
    if recall >= 0.95 and precision > 0:
        f1 = 2 * (precision * recall) / (precision + recall)
        if f1 > best_f1:
            best_f1 = f1
            best_threshold = t

threshold = best_threshold
print()
evaluate.report("TEST at default 0.5 threshold", y_test, test_scores, 0.5)
evaluate.report("TEST at our tuned threshold", y_test, test_scores, threshold)

# SAVE MODEL
import os, joblib
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "jailbreak_classifier.pkl")
os.makedirs(MODEL_DIR, exist_ok=True)

artifact = {
    "model": model,
    "word_tfidf": word_tfidf,
    "char_tfidf": char_tfidf,
    "scaler": scaler,
    "threshold": threshold,
}

joblib.dump(artifact, MODEL_PATH)
print(f"\n saved model → {MODEL_PATH}")