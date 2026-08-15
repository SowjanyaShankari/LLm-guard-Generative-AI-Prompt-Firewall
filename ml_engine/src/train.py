from scipy.sparse import csr_matrix, hstack
from sklearn.calibration import CalibratedClassifierCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MaxAbsScaler
from sklearn.svm import LinearSVC
import joblib
import os
import json

import evaluate
import features
import preprocess

SEED = 42

train, val, test = preprocess.get_splits()
print()
for name, part in [("train", train), ("val", val), ("test", test)]:
    print(f"{name}: {len(part)} rows, {part['y'].sum()} injections")

word_tfidf = TfidfVectorizer(ngram_range=(1, 2), min_df=2, max_features=50000, sublinear_tf=True)
char_tfidf = TfidfVectorizer(
    analyzer="char_wb", ngram_range=(3, 5), min_df=3, max_features=50000, sublinear_tf=True
)
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

# Tuned C parameter
C_value = 0.8
svm = LinearSVC(C=C_value, class_weight="balanced", random_state=SEED, max_iter=2000)
model = CalibratedClassifierCV(svm, cv=3)

print(f"training with C={C_value}...")
model.fit(X_train, train["y"])

val_scores = model.predict_proba(X_val)[:, 1]
test_scores = model.predict_proba(X_test)[:, 1]

y_test = test["y"].to_numpy()
y_val = val["y"].to_numpy()

# Threshold tuning on validation set
print("\nTuning threshold on validation set...")
best_threshold = 0.5
best_f1 = 0
best_metrics = {}

for t in [i / 1000 for i in range(1, 1000)]:
    val_preds = (val_scores >= t).astype(int)
    tp_val = ((val_preds == 1) & (y_val == 1)).sum()
    fp_val = ((val_preds == 1) & (y_val == 0)).sum()
    fn_val = ((val_preds == 0) & (y_val == 1)).sum()
    
    if tp_val + fp_val == 0:
        continue
    
    precision_val = tp_val / (tp_val + fp_val)
    recall_val = tp_val / (tp_val + fn_val)
    
    if recall_val >= 0.95 and precision_val > 0:
        f1 = 2 * (precision_val * recall_val) / (precision_val + recall_val)
        if f1 > best_f1:
            best_f1 = f1
            best_threshold = t
            best_metrics = {
                "precision": precision_val,
                "recall": recall_val,
                "f1": f1,
                "tp": int(tp_val),
                "fp": int(fp_val),
                "fn": int(fn_val),
            }

threshold = best_threshold
print(f"Best threshold: {threshold:.3f}")
print(f"Validation metrics: {best_metrics}")

print()
evaluate.report("TEST at default 0.5 threshold", y_test, test_scores, 0.5)
evaluate.report("TEST at optimized threshold", y_test, test_scores, threshold)

# Save model + metadata
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "jailbreak_classifier.pkl")
METADATA_PATH = os.path.join(MODEL_DIR, "model_metadata.json")
os.makedirs(MODEL_DIR, exist_ok=True)

artifact = {
    "model": model,
    "word_tfidf": word_tfidf,
    "char_tfidf": char_tfidf,
    "scaler": scaler,
    "threshold": threshold,
    "c_parameter": C_value,
}

joblib.dump(artifact, MODEL_PATH)

metadata = {
    "week": 4,
    "c_parameter": C_value,
    "threshold": threshold,
    "validation_metrics": best_metrics,
    "feature_count": X_train.shape[1],
    "training_samples": len(train),
    "validation_samples": len(val),
    "test_samples": len(test),
}

with open(METADATA_PATH, 'w') as f:
    json.dump(metadata, f, indent=2)

print(f"\nModel saved → {MODEL_PATH}")
print(f"Metadata saved → {METADATA_PATH}")