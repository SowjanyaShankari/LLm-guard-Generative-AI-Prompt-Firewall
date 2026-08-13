from scipy.sparse import csr_matrix, hstack
from sklearn.calibration import CalibratedClassifierCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MaxAbsScaler
from sklearn.svm import LinearSVC
import joblib
import os

import evaluate
import features
import preprocess

SEED = 42

train, val, test = preprocess.get_splits()
print()
for name, part in [("train", train), ("val", val), ("test", test)]:
    print(f"{name}: {len(part)} rows, {part['y'].sum()} injections")

word_tfidf = TfidfVectorizer(ngram_range=(1, 2), min_df=2, max_features=50000, sublinear_tf=True)
char_tfidf = TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), min_df=3, max_features=50000, sublinear_tf=True)
scaler = MaxAbsScaler()

print("\nbuilding features...")

X_train = hstack([
    word_tfidf.fit_transform(train["text"]),
    char_tfidf.fit_transform(train["text"]),
    csr_matrix(scaler.fit_transform(features.extra_features(train["text"]))),
])

def make_features(df):
    return hstack([
        word_tfidf.transform(df["text"]),
        char_tfidf.transform(df["text"]),
        csr_matrix(scaler.transform(features.extra_features(df["text"]))),
    ])

X_val = make_features(val)
X_test = make_features(test)

print("feature count:", X_train.shape[1])

svm = LinearSVC(C=1.0, class_weight="balanced", random_state=SEED)
model = CalibratedClassifierCV(svm, cv=3)

print("training...")
model.fit(X_train, train["y"])

val_scores = model.predict_proba(X_val)[:, 1]
test_scores = model.predict_proba(X_test)[:, 1]

y_test = test["y"].to_numpy()

best_threshold = 0.5
best_f1 = 0
for t in [i / 1000 for i in range(1, 1000)]:
    preds = (val_scores >= t).astype(int)
    tp = ((preds == 1) & (val["y"].values == 1)).sum()
    fp = ((preds == 1) & (val["y"].values == 0)).sum()
    fn = ((preds == 0) & (val["y"].values == 1)).sum()
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
print(f"\nthreshold picked on validation set: {threshold:.3f}")

print()
evaluate.report("TEST at default 0.5 threshold", y_test, test_scores, 0.5)
evaluate.report("TEST at our tuned threshold", y_test, test_scores, threshold)

# SAVE MODEL
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
print(f"\nModel saved successfully!")