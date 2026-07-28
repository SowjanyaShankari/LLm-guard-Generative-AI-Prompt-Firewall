"""
metrics.py

Calculates QA and security metrics.

Author: Member 6
Project: LLM-Guard
"""

import json
from pathlib import Path
from statistics import mean

from config.settings import LOG_DIRECTORY


class MetricsEngine:

    def __init__(self):

        self.log_file = Path(LOG_DIRECTORY) / "attack_results.jsonl"

    def load_results(self):

        results = []

        if not self.log_file.exists():
            return results

        with open(self.log_file, "r", encoding="utf-8") as file:

            for line in file:

                if line.strip():
                    results.append(json.loads(line))

        return results

    def calculate(self):

        results = self.load_results()

        if not results:

            return {
                "message": "No results found."
            }

        total = len(results)

        passed = sum(r["passed"] for r in results)

        failed = total - passed

        tp = sum(
            r["classification"] == "TRUE_POSITIVE"
            for r in results
        )

        tn = sum(
            r["classification"] == "TRUE_NEGATIVE"
            for r in results
        )

        fp = sum(
            r["classification"] == "FALSE_POSITIVE"
            for r in results
        )

        fn = sum(
            r["classification"] == "FALSE_NEGATIVE"
            for r in results
        )

        latencies = [
            r["latency"]
            for r in results
            if r["latency"] is not None
        ]

        return {

            "total_tests": total,

            "passed": passed,

            "failed": failed,

            "pass_rate": round(
                (passed / total) * 100,
                2
            ),

            "fail_rate": round(
                (failed / total) * 100,
                2
            ),

            "true_positive": tp,

            "true_negative": tn,

            "false_positive": fp,

            "false_negative": fn,

            "average_latency": round(
                mean(latencies),
                2
            ) if latencies else None,

            "minimum_latency": min(latencies)
            if latencies else None,

            "maximum_latency": max(latencies)
            if latencies else None
        }