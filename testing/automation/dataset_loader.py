"""
dataset_loader.py

Loads and validates all datasets.

Author: Member 6
Project: LLM-Guard
"""

import json
from pathlib import Path

from config.settings import DATASET_DIRECTORY


class DatasetLoader:
    """
    Loads attack datasets from JSON files.
    """

    REQUIRED_FIELDS = {
        "id",
        "category",
        "prompt",
        "expected"
    }

    def __init__(self):
        self.dataset_path = Path(DATASET_DIRECTORY)

    def load_file(self, filename):
        """
        Load a single dataset file.

        Parameters
        ----------
        filename : str

        Returns
        -------
        list
        """

        file_path = self.dataset_path / filename

        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        return data

    def validate(self, dataset):
        """
        Validate every dataset entry.
        """

        for item in dataset:

            missing = self.REQUIRED_FIELDS - item.keys()

            if missing:
                raise ValueError(
                    f"Missing fields {missing} in {item}"
                )

        return True

    def load_dataset(self, filename):
        """
        Load and validate one dataset.
        """

        dataset = self.load_file(filename)

        self.validate(dataset)

        return dataset

    def load_multiple(self, filenames):
        """
        Load multiple datasets.
        """

        merged = []

        for file in filenames:

            merged.extend(
                self.load_dataset(file)
            )

        return merged