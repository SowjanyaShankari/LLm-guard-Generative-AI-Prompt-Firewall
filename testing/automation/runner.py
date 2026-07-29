"""
runner.py

Professional CLI Runner for LLM-Guard Red Team Automation.

Author: Member 6
"""

import argparse

from tqdm import tqdm

from automation.attack_engine import AttackEngine
from automation.metrics import MetricsEngine
from automation.report_generator import ReportGenerator
import time


DEFAULT_DATASETS = [
    "jailbreak.json",
    "prompt_injection.json",
    "safe_prompts.json"
]


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="LLM-Guard Red Team Automation"
    )

    parser.add_argument(
        "--dataset",
        type=str,
        help="Run one dataset"
    )

    parser.add_argument(
        "--all",
        action="store_true",
        help="Run all datasets"
    )

    return parser.parse_args()


def print_summary(summary):

    print("\n" + "=" * 70)
    print("FINAL TEST SUMMARY")
    print("=" * 70)

    if "message" in summary:
        print(summary["message"])
        return

    for key, value in summary.items():
        print(f"{key:25} : {value}")

    print("=" * 70)


def main():

    args = parse_arguments()

    if args.dataset:

        datasets = [args.dataset]

    elif args.all:

        datasets = DEFAULT_DATASETS

    else:

        print(
            "Please specify either --dataset or --all"
        )

        return

    engine = AttackEngine()

    for dataset in datasets:

        print(f"\nRunning {dataset}\n")

        results = engine.execute_dataset(dataset)

        for _ in tqdm(results):
            pass

    summary = MetricsEngine().calculate()
    
    report = ReportGenerator()

    report.save_json(summary)

    report.save_csv(summary)

    report.save_html(summary)

    results = MetricsEngine().load_results()

    report.pass_fail_chart(summary)

    report.latency_chart(results)

    report.confusion_chart(summary)
    
    print_summary(summary)


if __name__ == "__main__":
    start = time.perf_counter()
    main()
    end = time.perf_counter()

    print(
    f"\nExecution Time: {round(end-start,2)} seconds"
)