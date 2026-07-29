from locust import HttpUser
from locust import task
from locust import between

import random

from payloads import (
    JAILBREAK_PROMPTS,
    SAFE_PROMPTS
)


class LLMGuardUser(HttpUser):

    wait_time = between(1, 3)

    @task(3)
    def jailbreak(self):

        prompt = random.choice(JAILBREAK_PROMPTS)

        self.client.post(
            "/api/chat",
            json={
                "prompt": prompt
            }
        )

    @task(1)
    def safe_prompt(self):

        prompt = random.choice(SAFE_PROMPTS)

        self.client.post(
            "/api/chat",
            json={
                "prompt": prompt
            }
        )