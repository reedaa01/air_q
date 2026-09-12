import pytest
from etl.extract import fetch_air_quality

def test_fetch_air_quality_rejects_invalid_longitude():
    with pytest.raises(ValueError):
        fetch_air_quality(latitude=34.0, longitude=-200.0)