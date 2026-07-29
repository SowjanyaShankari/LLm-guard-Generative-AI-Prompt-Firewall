"""
Factory for creating attack objects.
"""

from attacks.jailbreak import JailbreakAttack
from attacks.prompt_injection import PromptInjectionAttack
from attacks.roleplay import RoleplayAttack
from attacks.encoding import EncodingAttack
from attacks.unicode_attack import UnicodeAttack
from attacks.indirect_prompt import IndirectPromptAttack
from attacks.system_override import SystemOverrideAttack


class AttackFactory:
    """
    Factory class responsible for instantiating
    the appropriate attack object.
    """

    ATTACK_MAP = {
        "JAILBREAK": JailbreakAttack,
        "PROMPT_INJECTION": PromptInjectionAttack,
        "ROLEPLAY": RoleplayAttack,
        "ENCODING": EncodingAttack,
        "UNICODE": UnicodeAttack,
        "INDIRECT_PROMPT": IndirectPromptAttack,
        "SYSTEM_OVERRIDE": SystemOverrideAttack,
    }

    @classmethod
    def create(cls, category: str, prompt: str):
        """
        Create an attack object based on the attack category.

        Args:
            category (str): Attack category.
            prompt (str): Original prompt.

        Returns:
            BaseAttack: Attack object.
        """

        attack_class = cls.ATTACK_MAP.get(category.upper())

        if attack_class is None:
            supported = ", ".join(cls.ATTACK_MAP.keys())
            raise ValueError(
                f"Unknown attack category '{category}'. "
                f"Supported categories: {supported}"
            )

        return attack_class(prompt)