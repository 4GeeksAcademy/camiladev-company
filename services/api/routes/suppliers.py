from fastapi import APIRouter, HTTPException, Query
from datetime import datetime, timezone

from database import suppliers_table
from models import Suppliers, VALID_CATEGORIES, VALID_COUNTRY, VALID_STATUS


router = APIRouter(
    prefix="/suppliers", tags=["suppliers"]
    )



def serialize_document(document):
    return {
        "id": document.doc_id,
        **document
    }


def filter_suppliers(country: str | None = None, category: str | None = None):
    # Evita lecturas desactualizadas cuando la tabla fue modificada por otro proceso.
    suppliers_table.clear_cache()

    # Punto de partida: obtener todos los proveedores y luego aplicar filtros opcionales.
    documents = suppliers_table.all()

    if country is not None:
        # Si se envía país, primero validamos que esté en el catálogo permitido.
        if country not in VALID_COUNTRY:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid country '{country}'. Valid options are: {VALID_COUNTRY}"
            )
        # Filtra solo proveedores del país solicitado.
        documents = [doc for doc in documents if doc.get("country") == country]

    if category is not None:
        # Si se envía categoría, validamos contra las categorías definidas en el modelo.
        if category not in VALID_CATEGORIES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid category '{category}'. Valid options are: {VALID_CATEGORIES}"
            )
        # Filtra proveedores que contengan esa categoría en su lista de categorías.
        documents = [doc for doc in documents if category in doc.get("categories", [])]

    # Serializa cada documento para devolver también el id de TinyDB en la respuesta.
    return [
        serialize_document(document)
        for document in documents
    ]

# POST

@router.post("")
def create_suppliers(supplier: Suppliers):
    suppliers_data = supplier.model_dump(mode="json")
    doc_id = suppliers_table.insert(suppliers_data)

    return {
        "id": doc_id,
        **suppliers_data
    }


# GET /suppliers  —  opcionalmente filtrado por ?country=x y/o ?category=y
@router.get("")
def get_suppliers(
    country: str | None = Query(None),
    category: str | None = Query(None)
):
    return filter_suppliers(country=country, category=category)


# GET /suppliers/by-category?category=Y
@router.get("/by-category")
def get_suppliers_by_category(category: str = Query(...)):
    # Backward-compatible alias for clients already using this route.
    return filter_suppliers(category=category)

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


# DELETE /suppliers/{id}
@router.delete("/{supplier_id}")
def delete_supplier(supplier_id: int):
    existing_supplier = suppliers_table.get(doc_id=supplier_id)

    if existing_supplier is None:
        raise HTTPException(
            status_code=404,
            detail=f"Supplier with id {supplier_id} not found"
        )

    suppliers_table.remove(doc_ids=[supplier_id])

    return {"message": f"Supplier with id {supplier_id} deleted"}