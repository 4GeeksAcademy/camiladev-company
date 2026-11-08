import argparse
from uuid import UUID

from sqlmodel import Session, func, select
from tinydb import Query

from database import engine, users_table
from models import Asset, AssetEntry, AssetExit
from routers.inventory import asset_stock_statement
from schemas import AssetCreate, AssetEntryCreate, AssetExitCreate


ASSETS = (
    {"name": 'Port\u00e1til 14" Business', "sku": "NXV-IT-001", "category": "hardware", "office": "Valencia"},
    {"name": 'Port\u00e1til 14" Business', "sku": "NXV-IT-002", "category": "hardware", "office": "Miami"},
    {"name": "Rat\u00f3n ergon\u00f3mico", "sku": "NXV-PER-001", "category": "peripherals", "office": "Valencia"},
    {"name": "Hub USB-C", "sku": "NXV-PER-002", "category": "peripherals", "office": "Miami"},
    {"name": "Resma de papel A4", "sku": "NXV-OFF-001", "category": "office_supplies", "office": "Valencia"},
    {"name": "Cuaderno de formaci\u00f3n en liderazgo", "sku": "NXV-TRN-001", "category": "training_materials", "office": "Valencia"},
)

ENTRIES = (
    ("NXV-IT-001", 10, "TechDistrib Valencia S.L."),
    ("NXV-IT-001", 5, "TechDistrib Valencia S.L."),
    ("NXV-IT-002", 8, "Office Depot Miami"),
    ("NXV-OFF-001", 20, "TechDistrib Valencia S.L."),
)

EXITS = (
    ("NXV-IT-001", 3, "allocation", "Empleado Demo Valencia"),
    ("NXV-IT-002", 2, "allocation", "Empleado Demo Miami"),
    ("NXV-OFF-001", 4, "consumption", None),
)

EXPECTED_STOCK = {
    "NXV-IT-001": 12,
    "NXV-IT-002": 6,
    "NXV-PER-001": 0,
    "NXV-PER-002": 0,
    "NXV-OFF-001": 16,
    "NXV-TRN-001": 0,
}


def seed_inventory(user_uuid: str):
    UUID(user_uuid)
    user = users_table.get(Query().id == user_uuid)
    if user is None or not user.get("is_active"):
        raise ValueError("An existing active TinyDB user is required.")

    with Session(engine) as session:
        with session.begin():
            session.connection().exec_driver_sql(
                "LOCK TABLE asset, assetentry, assetexit IN SHARE ROW EXCLUSIVE MODE"
            )
            for model in (Asset, AssetEntry, AssetExit):
                if session.exec(select(func.count()).select_from(model)).one():
                    raise ValueError("Inventory must be empty; existing records were not changed.")

            assets_by_sku = {}
            for payload in ASSETS:
                asset = Asset(**AssetCreate(**payload).model_dump())
                session.add(asset)
                assets_by_sku[asset.sku] = asset
            session.flush()

            for sku, quantity, supplier in ENTRIES:
                asset = assets_by_sku[sku]
                data = AssetEntryCreate(
                    asset_id=asset.id, quantity=quantity,
                    supplier=supplier, office=asset.office,
                )
                session.add(AssetEntry(**data.model_dump(), user_uuid=user_uuid))
            session.flush()
            available = {asset.sku: stock for asset, stock in session.exec(asset_stock_statement()).all()}

            for sku, quantity, exit_type, assigned_to in EXITS:
                if quantity > available[sku]:
                    raise ValueError("Seed exit would exceed available stock.")
                asset = assets_by_sku[sku]
                data = AssetExitCreate(
                    asset_id=asset.id, quantity=quantity, exit_type=exit_type,
                    assigned_to=assigned_to, office=asset.office,
                )
                session.add(AssetExit(**data.model_dump(), user_uuid=user_uuid))
                available[sku] -= quantity
            session.flush()
            actual_stock = {asset.sku: stock for asset, stock in session.exec(asset_stock_statement()).all()}
            if actual_stock != EXPECTED_STOCK:
                raise ValueError("Seed stock does not match the expected order balance.")
    return actual_stock


def main():
    parser = argparse.ArgumentParser(description="Seed empty development inventory without deleting data.")
    parser.add_argument("--user-uuid", help="Existing active TinyDB user UUID; defaults to the sole active user.")
    args = parser.parse_args()
    user_uuid = args.user_uuid
    if user_uuid is None:
        active_users = [user for user in users_table.all() if user.get("is_active")]
        if len(active_users) != 1:
            parser.error("Specify --user-uuid when there is not exactly one active TinyDB user.")
        user_uuid = active_users[0]["id"]
    try:
        stocks = seed_inventory(user_uuid)
    except ValueError as error:
        parser.exit(1, f"{error}\n")
    except Exception:
        parser.exit(1, "Inventory seed failed; check connectivity and schema. No partial seed was committed.\n")
    print("Inserted 6 assets, 4 entries and 3 exits.")
    for sku, stock in stocks.items():
        print(f"{sku}: {stock}")


if __name__ == "__main__":
    main()