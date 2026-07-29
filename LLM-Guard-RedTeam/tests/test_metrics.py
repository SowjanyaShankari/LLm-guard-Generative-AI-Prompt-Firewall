from automation.metrics import MetricsEngine


def test_metrics_empty():

    engine = MetricsEngine()

    summary = engine.calculate()

    assert summary is not None