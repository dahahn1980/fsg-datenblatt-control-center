from control_center.models import ProductRow, ProductStatus
from control_center.workflow.state_machine import can_transition


def test_product_rows_are_unselected_by_default() -> None:
    row = ProductRow("p1", "Produkt 1", "seilzugsensoren")
    assert row.selected is False
    assert row.status is ProductStatus.NOT_CHECKED


def test_workflow_requires_ordered_progression() -> None:
    assert can_transition(ProductStatus.NOT_CHECKED, ProductStatus.CHECKED)
    assert not can_transition(ProductStatus.NOT_CHECKED, ProductStatus.PUBLISHED)


def test_error_can_be_rechecked() -> None:
    assert can_transition(ProductStatus.ERROR, ProductStatus.CHECKED)
