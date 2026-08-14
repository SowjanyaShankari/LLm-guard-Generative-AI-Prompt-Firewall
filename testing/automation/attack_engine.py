"""
attack_engine.py

Main execution engine for automated Red Team testing.

Author: Member 6
Project: LLM-Guard
"""

from automation.dataset_loader import DatasetLoader
from automation.api_client import APIClient
from tqdm import tqdm

class AttackEngine:

    def __init__(self):

        self.loader = DatasetLoader()

        self.client = APIClient()

    def execute_dataset(self, filename):

        dataset = self.loader.load_dataset(filename)

        results = []

        for attack in tqdm(
    dataset,
    desc=f"Testing {filename}",
    unit="prompt"
):

            response = self.client.send_prompt(
                attack["prompt"]
            )

            result = {

                "id": attack["id"],

                "category": attack["category"],

                "prompt": attack["prompt"],

                "expected": attack["expected"],

                "actual": response["status"],

                "latency": response["latency"],

                "response": response["response"],

                "reason": response["reason"]

            }

            results.append(result)

        return results