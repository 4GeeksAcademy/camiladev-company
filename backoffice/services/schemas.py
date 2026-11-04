from datetime import datetime
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, model_validator


Office = Literal["Valencia", "Miami"]
AssetCategory = Literal[
    "hardware", "peripherals", "office_supplies", "training_materials"
]
ExitType = Literal["allocation", "consumption"]
NonEmptyString = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
PositiveInteger = Annotated[int, Field(gt=0, strict=True)]


class InventorySchema(BaseModel):
    model_config = ConfigDict(extra="forbid")


class AssetCreate(InventorySchema):
    name: NonEmptyString
    sku: NonEmptyString
    category: AssetCategory
    office: Office


class AssetRead(AssetCreate):
    id: PositiveInteger
    current_stock: int = Field(strict=True)


class AssetEntryCreate(InventorySchema):
    asset_id: PositiveInteger
    quantity: PositiveInteger
    supplier: NonEmptyString
    office: Office


class AssetEntryRead(AssetEntryCreate):
    id: PositiveInteger
    created_at: datetime
    user_uuid: NonEmptyString


class AssetExitCreate(InventorySchema):
    asset_id: PositiveInteger
    quantity: PositiveInteger
    exit_type: ExitType
    assigned_to: NonEmptyString | None = None
    office: Office

    @model_validator(mode="after")
    def validate_assignment(self):
        if self.exit_type == "allocation" and self.assigned_to is None:
            raise ValueError("assigned_to is required for allocation.")
        if self.exit_type == "consumption" and self.assigned_to is not None:
            raise ValueError("assigned_to must be null for consumption.")
        return self


class AssetExitRead(AssetExitCreate):
    id: PositiveInteger
    created_at: datetime
    user_uuid: NonEmptyString


class AssetEntryOrder(AssetEntryRead):
    order_type: Literal["inbound"] = "inbound"
    asset: AssetRead


class AssetExitOrder(AssetExitRead):
    order_type: Literal["outbound"] = "outbound"
    asset: AssetRead