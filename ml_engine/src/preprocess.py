import os
import pandas as pd
from sklearn.model_selection import train_test_split

DATA_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data",
    "prompt_injection_detection_dataset.csv"
)

SEED = 42


def load_and_clean():
    df = pd.read_csv(DATA_PATH)
    print("rows loaded:", len(df))

    # Remove missing values
    df = df.dropna(subset=["text", "label", "split"])

    # Clean extra spaces
    df["text"] = (
        df["text"].astype(str)
        .str.replace(r"\s+", " ", regex=True)
        .str.strip()
    )
    df = df[df["text"] != ""]

    # Remove duplicate prompts
    df = df[~df["text"].str.lower().duplicated()]

    # 1 = injection, 0 = benign
    df["y"] = (
        df["label"].astype(str).str.lower().str.strip() == "injection"
    ).astype(int)

    print("rows after cleaning:", len(df))
    return df.reset_index(drop=True)


def get_splits():
    df = load_and_clean()

    train_all = df[df["split"].astype(str).str.lower() == "train"]
    test = df[df["split"].astype(str).str.lower() == "test"]

    train, val = train_test_split(
        train_all,
        test_size=0.2,
        random_state=SEED,
        stratify=train_all["y"]
    )

    return train, val, test


if __name__ == "__main__":
    train, val, test = get_splits()

    print()

    for name, part in [
        ("train", train),
        ("val", val),
        ("test", test)
    ]:
        pct = 100 * part["y"].mean()
        print(
            f"{name}: {len(part)} rows, "
            f"{part['y'].sum()} injections ({pct:.1f}%)"
        )

    print("\ninjection types in train:")
    print(
        train[train["y"] == 1]["category"]
        .value_counts()
        .to_string()
    )

    print(
        f"\nalways guessing benign = "
        f"{100 * (1 - test['y'].mean()):.1f}% accuracy"
    )