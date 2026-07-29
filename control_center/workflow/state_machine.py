from __future__ import annotations

from control_center.models import ProductStatus


_ALLOWED_TRANSITIONS: dict[ProductStatus, set[ProductStatus]] = {
    ProductStatus.NOT_CHECKED: {ProductStatus.CHECKED, ProductStatus.ERROR},
    ProductStatus.CHECKED: {ProductStatus.READY, ProductStatus.ERROR},
    ProductStatus.READY: {ProductStatus.PREVIEW_CREATED, ProductStatus.ERROR},
    ProductStatus.PREVIEW_CREATED: {ProductStatus.PUBLISHED, ProductStatus.ERROR},
    ProductStatus.PUBLISHED: {ProductStatus.CHECKED, ProductStatus.ERROR},
    ProductStatus.ERROR: {ProductStatus.CHECKED},
}


def can_transition(current: ProductStatus, target: ProductStatus) -> bool:
    """Return whether a product may enter the requested workflow state."""
    return target in _ALLOWED_TRANSITIONS[current]
