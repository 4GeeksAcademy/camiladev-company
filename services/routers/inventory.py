from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, func, select

from database import get_db
from models import Asset, AssetEntry, AssetExit
from routes.auth import get_current_user
from schemas import (
    AssetCreate, AssetRead, AssetEntryCreate, AssetEntryRead, AssetEntryOrder,
    AssetExitCreate, AssetExitRead, AssetExitOrder, Office,
)


router = APIRouter(prefix="/inventory", tags=["inventory"])


def inventory_user(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_active"):
        raise HTTPException(403, "Inactive user.")
    try:
        UUID(current_user["id"])
    except (KeyError, TypeError, ValueError):
        raise HTTPException(403, "A valid user UUID is required.") from None
    return current_user


def asset_stock_statement():
    entries = select(
        AssetEntry.asset_id, func.sum(AssetEntry.quantity).label("quantity")
    ).group_by(AssetEntry.asset_id).subquery()
    exits = select(
        AssetExit.asset_id, func.sum(AssetExit.quantity).label("quantity")
    ).group_by(AssetExit.asset_id).subquery()
    return select(
        Asset,
        (func.coalesce(entries.c.quantity, 0) - func.coalesce(exits.c.quantity, 0)).label("current_stock"),
    ).outerjoin(entries, entries.c.asset_id == Asset.id).outerjoin(exits, exits.c.asset_id == Asset.id)


def asset_response(asset: Asset, stock: int):
    return AssetRead(**asset.model_dump(), current_stock=stock)


def locked_asset(session: Session, asset_id: int, office: str):
    asset = session.exec(select(Asset).where(Asset.id == asset_id).with_for_update()).first()
    if asset is None:
        raise HTTPException(404, "Asset not found.")
    if asset.office != office:
        raise HTTPException(400, "Order office must match asset office.")
    return asset


@router.get("/products", response_model=list[AssetRead])
def list_assets(
    office: Office | None = Query(default=None),
    session: Session = Depends(get_db),
):
    statement = asset_stock_statement().order_by(Asset.id)
    if office is not None:
        statement = statement.where(Asset.office == office)
    return [asset_response(asset, stock) for asset, stock in session.exec(statement).all()]


@router.post("/products", response_model=AssetRead, status_code=201)
def create_asset(
    data: AssetCreate,
    current_user: dict = Depends(inventory_user),
    session: Session = Depends(get_db),
):
    if session.exec(select(Asset.id).where(Asset.sku == data.sku)).first() is not None:
        raise HTTPException(409, "Asset SKU already exists.")
    asset = Asset(**data.model_dump())
    session.add(asset)
    try:
        session.commit()
    except Exception as error:
        session.rollback()
        if getattr(getattr(error, "orig", None), "pgcode", None) == "23505":
            raise HTTPException(409, "Asset SKU already exists.") from None
        raise
    session.refresh(asset)
    return asset_response(asset, 0)


@router.get("/products/{id}", response_model=AssetRead)
def get_asset(id: int, session: Session = Depends(get_db)):
    result = session.exec(asset_stock_statement().where(Asset.id == id)).first()
    if result is None:
        raise HTTPException(404, "Asset not found.")
    return asset_response(*result)


@router.post("/orders/inbound", response_model=AssetEntryRead, status_code=201)
def create_entry(
    data: AssetEntryCreate,
    current_user: dict = Depends(inventory_user),
    session: Session = Depends(get_db),
):
    locked_asset(session, data.asset_id, data.office)
    entry = AssetEntry(**data.model_dump(), user_uuid=current_user["id"])
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return AssetEntryRead(**entry.model_dump())


@router.post("/orders/outbound", response_model=AssetExitRead, status_code=201)
def create_exit(
    data: AssetExitCreate,
    current_user: dict = Depends(inventory_user),
    session: Session = Depends(get_db),
):
    asset = locked_asset(session, data.asset_id, data.office)
    _, available = session.exec(asset_stock_statement().where(Asset.id == asset.id)).one()
    if data.quantity > available:
        raise HTTPException(
            400,
            f"Insufficient stock for asset '{asset.name}'. Available: {available}, requested: {data.quantity}.",
        )
    exit_order = AssetExit(**data.model_dump(), user_uuid=current_user["id"])
    session.add(exit_order)
    session.commit()
    session.refresh(exit_order)
    return AssetExitRead(**exit_order.model_dump())


@router.get("/orders", response_model=list[AssetEntryOrder | AssetExitOrder])
def list_orders(
    office: Office | None = Query(default=None),
    session: Session = Depends(get_db),
):
    orders = []
    for model, response in ((AssetEntry, AssetEntryOrder), (AssetExit, AssetExitOrder)):
        statement = asset_stock_statement().add_columns(model).join(model, model.asset_id == Asset.id)
        if office is not None:
            statement = statement.where(model.office == office)
        for asset, stock, order in session.exec(statement).all():
            orders.append(response(**order.model_dump(), asset=asset_response(asset, stock)))
    return sorted(orders, key=lambda order: (order.created_at, order.order_type, order.id))