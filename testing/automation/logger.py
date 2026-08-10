"""
logger.py

Logs attack results for later analysis.

Author: Member 6
Project: LLM-Guard
"""

import json
from pathlib import Path
from datetime import datetime

from config.settings import LOG_DIRECTORY


class Logger:

    def __init__(self):

        self.log_dir = Path(LOG_DIRECTORY)

        self.log_dir.mkdir(exist_ok=True)

        self.result_file = self.log_dir / "attack_results.jsonl"

        self.error_file = self.log_dir / "errors.log"

    def log_result(self, result):
        """
        Save one attack result.
        """

        record = {
            "timestamp": datetime.now().isoformat(),
            **result
        }

        with open(
            self.result_file,
            "a",
            encoding="utf-8"
        ) as file:

            file.write(
                json.dumps(record)
            )

            file.write("\n")

    def log_error(self, message):
        """
        Save one error message.
        """

        with open(
            self.error_file,
            "a",
            encoding="utf-8"
        ) as file:

            file.write(
                f"[{datetime.now().isoformat()}] {message}\n"
            )