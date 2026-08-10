# LLM-Guard ML Engine

Detects prompt injection and jailbreak attempts.

## Files

```
data/       prompt_injection_detection_dataset.csv   (20,000 prompts)
src/
  preprocess.py   load, clean, label, split
  features.py     TF-IDF + my own attack features
  evaluate.py     threshold and metrics
  train.py        trains the model
```

## Run

Mac / Linux:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python src/train.py
```

Windows:

```
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python src\train.py
```

## Results

Test set: 138 attacks, 2,863 benign prompts.

| threshold | block rate | precision | false alarms | PR-AUC |
| --- | --- | --- | --- | --- |
| 0.117 (tuned) | 98.55% | 87.74% | 0.66% | 0.9880 |
| 0.5 (default) | 94.93% | 97.04% | 0.14% | 0.9880 |

Caught 136 of 138 attacks, wrongly blocked 19 of 2,863 benign prompts.
The default 0.5 threshold fails the 95% target, so tuning it matters.

I also tried plain LogisticRegression instead of the calibrated LinearSVC.
Same block rate but false alarms jumped to 2.48%, so I kept the SVC.
