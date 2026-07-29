"""
Shared pytest fixtures.
"""

import pytest

from automation.validator import Validator
from automation.dataset_loader import DatasetLoader


@pytest.fixture
def validator():

    return Validator()


@pytest.fixture
def loader():

    return DatasetLoader()