"""
validator.py

Validates firewall responses against expected results.

Author: Member 6
Project: LLM-Guard
"""


class Validator:
    """
    Validates firewall responses.
    """

    def validate(self, expected, actual):
        """
        Compare expected and actual result.
        """

        expected = expected.upper().strip()
        actual = actual.upper().strip()

        passed = expected == actual

        return {
            "expected": expected,
            "actual": actual,
            "passed": passed,
            "classification": self.classify(expected, actual)
        }

    def classify(self, expected, actual):
        """
        Classify the result.
        """

        if expected == "BLOCK" and actual == "BLOCK":
            return "TRUE_POSITIVE"

        if expected == "ALLOW" and actual == "ALLOW":
            return "TRUE_NEGATIVE"

        if expected == "BLOCK" and actual == "ALLOW":
            return "FALSE_NEGATIVE"

        if expected == "ALLOW" and actual == "BLOCK":
            return "FALSE_POSITIVE"

        return "UNKNOWN"