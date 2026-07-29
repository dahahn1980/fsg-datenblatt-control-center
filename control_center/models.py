from __future__ import annotations

from dataclasses import dataclass, field
from enum import StrEnum


class ProductStatus(StrEnum):
    NOT_CHECKED = "nicht_geprueft"
    CHECKED = "geprueft"
    READY = "freigegeben"
    PREVIEW_CREATED = "vorschau_erstellt"
    PUBLISHED = "veroeffentlicht"
    ERROR = "fehler"


@dataclass(slots=True)
class ProductRow:
    product_key: str
    title: str
    product_group: str
    status: ProductStatus = ProductStatus.NOT_CHECKED
    selected: bool = False
    errors: list[str] = field(default_factory=list)
    source_hash: str | None = None
    template_version: str | None = None
