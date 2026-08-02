"""
Base class for all attack implementations.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any


class BaseAttack(ABC):
    """
    Abstract base class for all attacks.

    Every attack must inherit from this class and implement
    the prepare() method.
    """

    def __init__(self, prompt: str):
        """
        Initialize the attack.

        Args:
            prompt (str): Original prompt to attack.
        """
        self.prompt = prompt.strip()

    @property
    def category(self) -> str:
        """
        Returns the attack category.

        Example:
            JAILBREAK
            PROMPT_INJECTION
            ROLEPLAY
        """
        return self.__class__.__name__.replace("Attack", "").upper()

    @abstractmethod
    def prepare(self) -> Dict[str, Any]:
        """
        Prepare the attack payload.

        Returns:
            Dictionary containing the payload that will
            be sent to the API.
        """
        pass

    def metadata(self) -> Dict[str, str]:
        """
        Optional metadata about the attack.

        Returns:
            Dictionary containing attack metadata.
        """
        return {
            "attack": self.__class__.__name__,
            "category": self.category,
        }

    def build_payload(self, prompt: str) -> Dict[str, Any]:
        """
        Build a standardized payload.

        Args:
            prompt (str): Transformed attack prompt.

        Returns:
            Standard payload dictionary.
        """
        return {
            "category": self.category,
            "prompt": prompt,
        }

    def __repr__(self) -> str:
        return (
            f"{self.__class__.__name__}"
            f"(category='{self.category}')"
        )