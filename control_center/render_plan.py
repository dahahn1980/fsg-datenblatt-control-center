from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Iterable

from .models import ProductRow, ProductStatus


@dataclass(frozen=True, slots=True)
class RenderPlan:
    created_at: str
    mode: str
    publish: bool
    batch_size: int
    products: tuple[dict[str, str | None], ...]

    def as_dict(self) -> dict:
        return {
            "schemaVersion": 1,
            "createdAt": self.created_at,
            "mode": self.mode,
            "publish": self.publish,
            "batchSize": self.batch_size,
            "source": "fsg-datenblatt-control-center",
            "products": list(self.products),
        }


def create_preview_plan(products: Iterable[ProductRow], batch_size: int = 10) -> RenderPlan:
    if not 1 <= batch_size <= 20:
        raise ValueError("batch_size muss zwischen 1 und 20 liegen")

    selected = [product for product in products if product.selected]
    if not selected:
        raise ValueError("Mindestens ein Produkt muss ausgewählt sein")

    blocked = [product.title for product in selected if product.errors or product.status == ProductStatus.ERROR]
    if blocked:
        raise ValueError("Produkte mit Fehlern dürfen nicht gerendert werden: " + ", ".join(blocked))

    payload = tuple(
        {
            "productKey": product.product_key,
            "title": product.title,
            "productGroup": product.product_group,
            "templateVersion": product.template_version,
            "sourceHash": product.source_hash,
        }
        for product in selected
    )
    return RenderPlan(
        created_at=datetime.now(timezone.utc).isoformat(),
        mode="preview",
        publish=False,
        batch_size=batch_size,
        products=payload,
    )
