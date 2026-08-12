from sklearn.metrics import average_precision_score, confusion_matrix, precision_recall_curve

TARGET_RECALL = 0.95


def pick_threshold(y, scores, target_recall=TARGET_RECALL):
    precision, recall, thresholds = precision_recall_curve(y, scores)

    # precision_recall_curve returns one less threshold than recall values
    recall = recall[:-1]

    good_enough = recall >= target_recall

    if not good_enough.any():
        print("Warning: could not reach 95% block rate at any threshold")
        return 0.5

    return float(thresholds[good_enough].max())


def report(name, y, scores, threshold):
    pred = (scores >= threshold).astype(int)

    tn, fp, fn, tp = confusion_matrix(
        y, pred, labels=[0, 1]
    ).ravel()

    recall = tp / max(tp + fn, 1)
    precision = tp / max(tp + fp, 1)
    false_alarm = fp / max(fp + tn, 1)

    print(f"\n{'-' * 55}")
    print(f"{name} (threshold {threshold:.3f})")
    print("-" * 55)

    print(f"  block rate (recall)  {recall:>7.2%}   <- want 95% or more")
    print(f"  precision            {precision:>7.2%}")
    print(f"  false alarms         {false_alarm:>7.2%}")
    print(f"  PR-AUC               {average_precision_score(y, scores):>7.4f}")
    print(f"  accuracy             {(tp + tn) / len(y):>7.2%}")

    print(f"\n  caught {tp} attacks, missed {fn}")
    print(f"  wrongly blocked {fp} of {fp + tn} benign prompts")

    print(
        f"  [{'PASS' if recall >= TARGET_RECALL else 'FAIL'}] "
        f"95% block rate"
    )