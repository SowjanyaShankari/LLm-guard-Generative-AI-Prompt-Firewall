from typing import Any, Dict, List

from tqdm import tqdm

from automation.api_client import APIClient
from automation.dataset_loader import DatasetLoader


class AttackEngine:
    """
    Main execution engine for Red Team attack datasets.

    Workflow:

        Dataset
            ↓
        DatasetLoader
            ↓
        AttackEngine
            ↓
        APIClient
            ↓
        LLM-Guard API
            ↓
        Results
    """

    def __init__(self) -> None:
        """Initialize the dataset loader and API client."""

        self.loader = DatasetLoader()
        self.client = APIClient()

    def execute_dataset(
        self,
        filename: str,
    ) -> List[Dict[str, Any]]:
        """
        Execute all prompts from one dataset.

        Args:
            filename: Dataset filename, for example
                      'jailbreak.json'.

        Returns:
            A list containing one result dictionary
            for every executed prompt.
        """

        dataset = self.loader.load_dataset(filename)

        results: List[Dict[str, Any]] = []

        for attack in tqdm(
            dataset,
            desc=f"Testing {filename}",
            unit="prompt",
        ):
            prompt = attack["prompt"]

            response = self.client.send_prompt(prompt)

            result: Dict[str, Any] = {
                "id": attack["id"],
                "category": attack["category"],
                "prompt": prompt,
                "expected": attack["expected"],
                "actual": response["status"],
                "latency": response["latency"],
                "response": response["response"],
                "reason": response["reason"],
            }

            results.append(result)

        return results

    def execute_multiple_datasets(
        self,
        filenames: List[str],
    ) -> List[Dict[str, Any]]:
        """
        Execute multiple datasets and combine their results.

        Args:
            filenames: List of dataset filenames.

        Returns:
            A combined list containing results from
            all supplied datasets.
        """

        all_results: List[Dict[str, Any]] = []

        for filename in filenames:
            dataset_results = self.execute_dataset(filename)
            all_results.extend(dataset_results)

        return all_results