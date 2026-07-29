"""
api_client.py

Handles communication with the LLM-Guard API.

Author: Member 6
Project: LLM-Guard
"""

import time
import requests

from config.settings import (
    API_BASE_URL,
    API_ENDPOINT,
    API_TIMEOUT,
    API_RETRY
)


class APIClient:
    """
    Sends prompts to the LLM-Guard firewall.
    """

    def __init__(self):
        self.url = API_BASE_URL + API_ENDPOINT

    def send_prompt(self, prompt):
        """
        Send one prompt to the firewall.
        """

        payload = {
            "prompt": prompt
        }

        retries = API_RETRY

        while retries > 0:

            try:

                start = time.perf_counter()

                response = requests.post(
                    self.url,
                    json=payload,
                    timeout=API_TIMEOUT
                )

                end = time.perf_counter()

                latency = round(
                    (end - start) * 1000,
                    2
                )

                response.raise_for_status()

                data = response.json()

                return {

                    "success": True,

                    "status": data.get(
                        "status",
                        "UNKNOWN"
                    ),

                    "response": data.get(
                        "response",
                        ""
                    ),

                    "reason": data.get(
                        "reason",
                        ""
                    ),

                    "latency": latency,

                    "http_status": response.status_code
                }

            except requests.Timeout:

                retries -= 1

                if retries == 0:

                    return {

                        "success": False,

                        "status": "TIMEOUT",

                        "response": "",

                        "reason": "Request Timed Out",

                        "latency": None,

                        "http_status": None
                    }

            except requests.RequestException as error:

                return {

                    "success": False,

                    "status": "ERROR",

                    "response": "",

                    "reason": str(error),

                    "latency": None,

                    "http_status": None
                }