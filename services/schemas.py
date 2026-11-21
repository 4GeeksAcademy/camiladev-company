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


class MessageRead(BaseModel):
    message: str


class ProfileRead(BaseModel):
    name: str | None
    phone: str | None
    address: str | None


class HomeRead(BaseModel):
    message: str


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


class AssetEntryRead(InventorySchema):
    id: PositiveInteger
    asset_id: PositiveInteger
    quantity: PositiveInteger
    supplier: NonEmptyString
    office: Office
    created_at: datetime
    user_uuid: NonEmptyString


class AssetExitRead(InventorySchema):
    id: PositiveInteger
    asset_id: PositiveInteger
    quantity: PositiveInteger
    exit_type: ExitType
    assigned_to: NonEmptyString | None
    office: Office
    created_at: datetime
    user_uuid: NonEmptyString


class AssetOrderRead(InventorySchema):
    id: PositiveInteger
    quantity: PositiveInteger
    created_at: datetime
    asset_name: NonEmptyString
    asset_sku: NonEmptyString


class AssetEntryOrder(AssetOrderRead):
    order_type: Literal["inbound"] = "inbound"


class AssetExitOrder(AssetOrderRead):
    order_type: Literal["outbound"] = "outbound"