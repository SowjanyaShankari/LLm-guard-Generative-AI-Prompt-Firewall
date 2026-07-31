def test_dataset_loading(loader):

    dataset = loader.load_dataset(

        "jailbreak.json"

    )

    assert len(dataset) > 0


def test_required_fields(loader):

    dataset = loader.load_dataset(

        "jailbreak.json"

    )

    first = dataset[0]

    assert "id" in first

    assert "category" in first

    assert "prompt" in first

    assert "expected" in first