import pytest

from control_center.models import ProductRow, ProductStatus
from control_center.render_plan import create_preview_plan


def product(**overrides):
    values = {
        "product_key": "pe-test",
        "title": "PE-TEST",
        "product_group": "neigungssensoren",
        "status": ProductStatus.READY,
        "selected": True,
        "errors": [],
        "source_hash": "abc",
        "template_version": "inclination-v1.7",
    }
    values.update(overrides)
    return ProductRow(**values)


def test_preview_plan_is_never_published():
    plan = create_preview_plan([product()])
    assert plan.publish is False
    assert plan.mode == "preview"
    assert plan.products[0]["productKey"] == "pe-test"


def test_products_with_errors_are_blocked():
    with pytest.raises(ValueError, match="Fehlern"):
        create_preview_plan([product(status=ProductStatus.ERROR, errors=["Einbaulage"])])


def test_empty_selection_is_blocked():
    with pytest.raises(ValueError, match="ausgewählt"):
        create_preview_plan([product(selected=False)])


def test_batch_size_is_limited():
    with pytest.raises(ValueError, match="zwischen 1 und 20"):
        create_preview_plan([product()], batch_size=50)
