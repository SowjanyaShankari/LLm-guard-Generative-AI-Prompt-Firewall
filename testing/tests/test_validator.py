def test_block_prompt(validator):

    result = validator.validate(

        expected="BLOCK",

        actual="BLOCK"

    )

    assert result["passed"] is True

    assert result["classification"] == "TRUE_POSITIVE"


def test_safe_prompt(validator):

    result = validator.validate(

        expected="ALLOW",

        actual="ALLOW"

    )

    assert result["passed"] is True

    assert result["classification"] == "TRUE_NEGATIVE"


def test_false_negative(validator):

    result = validator.validate(

        expected="BLOCK",

        actual="ALLOW"

    )

    assert result["passed"] is False

    assert result["classification"] == "FALSE_NEGATIVE"


def test_false_positive(validator):

    result = validator.validate(

        expected="ALLOW",

        actual="BLOCK"

    )

    assert result["passed"] is False

    assert result["classification"] == "FALSE_POSITIVE"