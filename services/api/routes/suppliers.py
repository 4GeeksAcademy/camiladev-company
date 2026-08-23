from fastapi import APIRouter, HTTPException, Query
from tinydb import Query as TinyDBQuery
from datetime import datetime, timezone

from database import suppliers_table
from models import Suppliers, VALID_COUNTRY, VALID_STATUS


router = APIRouter(
    prefix="/suppliers", tags=["suppliers"]
    )



def serialize_document(document):
    return {
        "id": document.doc_id,
        **document
    }

# POST

@router.post("")
def create_suppliers(supplier: Suppliers):
    suppliers_data = supplier.model_dump() 
    doc_id = suppliers_table.insert(suppliers_data) 

    return {
        "id": doc_id,
        **suppliers_data
    }


# GET /suppliers  —  opcionalmente filtrado por ?country=x
@router.get("")
def get_suppliers(country: str | None = Query(None)):
    # TinyDB can cache search results; clear cache to avoid stale reads
    # when data is modified from another process (e.g. running seed.py).
    suppliers_table.clear_cache()

    if country is None:
        # Sin filtro: devolver todos los proveedores
        documents = suppliers_table.all()
    else:
        # Con filtro: validar país y buscar solo los de ese país
        if country not in VALID_COUNTRY:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid country '{country}'. Valid options are: {VALID_COUNTRY}"
            )

        db_query = TinyDBQuery()
        documents = suppliers_table.search(db_query.country == country)

    return [
        serialize_document(document)
        for document in documents
    ]

# PATCH /suppliers/{id}/status
@router.patch("/{supplier_id}/status")
def update_supplier_status(supplier_id: int, payload: dict):
    new_status = payload.get("status")

    if new_status is None:
        raise HTTPException(status_code=400, detail="Field 'status' is required")

    if new_status not in VALID_STATUS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{new_status}'. Valid options are: {VALID_STATUS}"
        )

    existing_supplier = suppliers_table.get(doc_id=supplier_id)

    if existing_supplier is None:
        raise HTTPException(
            status_code=404,
            detail=f"Supplier with id {supplier_id} not found"
        )

    suppliers_table.update(
        {
            "status": new_status,
            "updated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        },
        doc_ids=[supplier_id]
    )

    updated_supplier = suppliers_table.get(doc_id=supplier_id)

    return serialize_document(updated_supplier)


# PATCH /suppliers/{id}/rate
@router.patch("/{supplier_id}/rate")
def update_supplier_rate(supplier_id: int, payload: dict):
    new_rate = payload.get("monthly_rate")

    if new_rate is None:
        raise HTTPException(status_code=400, detail="Field 'monthly_rate' is required")

    try:
        parsed_rate = float(new_rate)
    except (TypeError, ValueError) as error:
        raise HTTPException(status_code=400, detail="'monthly_rate' must be a number") from error

    if parsed_rate <= 0:
        raise HTTPException(status_code=400, detail="'monthly_rate' must be greater than 0")

    existing_supplier = suppliers_table.get(doc_id=supplier_id)

    if existing_supplier is None:
        raise HTTPException(
            status_code=404,
            detail=f"Supplier with id {supplier_id} not found"
        )

    suppliers_table.update(
        {
            "monthly_rate": parsed_rate,
            "updated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        },
        doc_ids=[supplier_id]
    )

    updated_supplier = suppliers_table.get(doc_id=supplier_id)

    return serialize_document(updated_supplier)