"""
Tests for the LLM-Guard AttackEngine.

Project: LLM-Guard
"""

import json
from pathlib import Path

from automation.attack_engine import AttackEngine


DATASET_DIR = Path("datasets")

DATASETS = [
    "jailbreak.json",
    "prompt_injection.json",
    "roleplay.json",
    "encoding.json",
    "unicode.json",
    "indirect_prompt.json",
    "system_override.json",
    "safe_prompts.json",
]


def load_real_dataset(filename):
    """Load and validate a real project dataset."""

    path = DATASET_DIR / filename

    assert path.exists(), f"Dataset not found: {path}"

    with path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    assert isinstance(data, list), (
        f"{filename} must contain a JSON list"
    )

    assert data, (
        f"{filename} is empty"
    )

    return data


def mock_api_response(prompt):
    """
    Controlled API response used only for unit testing.

    The actual AttackEngine logic is still exercised.
    """

    return {
        "status": "BLOCK",
        "latency": 100,
        "response": "Request blocked",
        "reason": "Security policy violation",
    }


def test_attack_engine_processes_all_datasets(monkeypatch):
    """
    Verify that AttackEngine can process every real dataset.
    """

    engine = AttackEngine()

    monkeypatch.setattr(
        engine.client,
        "send_prompt",
        mock_api_response,
    )

    for filename in DATASETS:

        dataset = load_real_dataset(filename)

        results = engine.execute_dataset(filename)

        assert len(results) == len(dataset)

        first_result = results[0]
        first_attack = dataset[0]

        assert first_result["id"] == first_attack["id"]
        assert first_result["category"] == first_attack["category"]
        assert first_result["prompt"] == first_attack["prompt"]
        assert first_result["expected"] == first_attack["expected"]

        assert first_result["actual"] == "BLOCK"
        assert first_result["latency"] == 100
        assert first_result["response"] == "Request blocked"
        assert first_result["reason"] == (
            "Security policy violation"
        )


def test_attack_engine_processes_every_prompt(monkeypatch):
    """
    Verify that every prompt in every dataset is sent
    to the API client.
    """

    engine = AttackEngine()

    calls = []

    def tracking_api_response(prompt):
        calls.append(prompt)
        return mock_api_response(prompt)

    monkeypatch.setattr(
        engine.client,
        "send_prompt",
        tracking_api_response,
    )

    expected_total = 0

    for filename in DATASETS:

        dataset = load_real_dataset(filename)

        expected_total += len(dataset)

        engine.execute_dataset(filename)

    assert len(calls) == expected_total


def test_attack_engine_multiple_datasets(monkeypatch):
    """
    Verify that execute_multiple_datasets() combines
    results from all real datasets.
    """

    engine = AttackEngine()

    monkeypatch.setattr(
        engine.client,
        "send_prompt",
        mock_api_response,
    )

    results = engine.execute_multiple_datasets(DATASETS)

    expected_total = sum(
        len(load_real_dataset(filename))
        for filename in DATASETS
    )

    assert len(results) == expected_total


def test_all_required_datasets_exist():
    """
    Verify that all expected project datasets exist.
    """

    for filename in DATASETS:

        path = DATASET_DIR / filename

        assert path.exists(), (
            f"Required dataset is missing: {filename}"
        )


def test_all_datasets_have_required_fields():
    """
    Verify that every attack entry contains the fields
    required by AttackEngine.
    """

    required_fields = {
        "id",
        "category",
        "prompt",
        "expected",
    }

    for filename in DATASETS:

        dataset = load_real_dataset(filename)

        for index, attack in enumerate(dataset):

            assert isinstance(attack, dict), (
                f"{filename}: entry {index} is not an object"
            )

            missing_fields = required_fields - set(attack)

            assert not missing_fields, (
                f"{filename}: entry {index} is missing "
                f"fields: {missing_fields}"
            )