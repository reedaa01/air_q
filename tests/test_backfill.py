import pytest
from etl.backfill import validate_date_range

def test_validate_date_range_accepts_valid_range():
    validate_date_range("2026-09-01", "2026-09-05")

def test_validate_date_range_rejects_reversed_range():
    with pytest.raises(ValueError):
        validate_date_range("2026-09-06", "2026-09-05")