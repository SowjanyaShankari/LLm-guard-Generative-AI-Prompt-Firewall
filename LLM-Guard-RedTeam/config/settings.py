"""
settings.py

Loads project configuration from config.json.

Author: Member 6 (QA / Red Team Automation Engineer)
Project: LLM-Guard
"""

import json
from pathlib import Path


# Get the directory containing this file
CONFIG_DIR = Path(__file__).parent

# Path to config.json
CONFIG_FILE = CONFIG_DIR / "config.json"


def load_config():
    """
    Load configuration from config.json.

    Returns:
        dict: Configuration dictionary.
    """
    with open(CONFIG_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


# Load configuration once
CONFIG = load_config()


# API Settings
API_BASE_URL = CONFIG["api"]["base_url"]
API_ENDPOINT = CONFIG["api"]["endpoint"]
API_TIMEOUT = CONFIG["api"]["timeout"]
API_RETRY = CONFIG["api"]["retry"]


# Logging
LOG_DIRECTORY = CONFIG["logging"]["directory"]


# Reports
REPORT_DIRECTORY = CONFIG["reports"]["directory"]


# Dataset
DATASET_DIRECTORY = CONFIG["datasets"]["directory"]