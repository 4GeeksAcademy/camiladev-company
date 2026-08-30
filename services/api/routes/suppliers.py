from fastapi import APIRouter, HTTPException, Query
from datetime import datetime, timezone

from database import suppliers_table
from models import Suppliers, SupplierStatusPatch, SupplierRatePatch, SupplierRead, Category, Country

router = APIRouter(
    prefix="/suppliers", tags=["suppliers"]
    )



def serialize_document(document):
    payload = {
        "id": document.doc_id,
        **document
    }
    return SupplierRead(**payload).model_dump(mode="json")


def filter_suppliers(country: str | None = None, category: str | None = None):
    # Evita lecturas desactualizadas cuando la tabla fue modificada por otro proceso.
    suppliers_table.clear_cache()

    # Punto de partida: obtener todos los proveedores y luego aplicar filtros opcionales.
    documents = suppliers_table.all()

    if country is not None:
        # Si se envía país, primero validamos que esté en el catálogo permitido.
        try:
            country_value = Country(country).value
        except ValueError:
            valid_country = [item.value for item in Country]
            raise HTTPException(
                status_code=400,
                detail=f"Invalid country '{country}'. Valid options are: {valid_country}"
            )
        # Filtra solo proveedores del país solicitado.
        documents = [doc for doc in documents if doc.get("country") == country_value]

    if category is not None:
        # Si se envía categoría, validamos contra las categorías definidas en el modelo.
        try:
            category_value = Category(category).value
        except ValueError:
            valid_categories = [item.value for item in Category]
            raise HTTPException(
                status_code=400,
                detail=f"Invalid category '{category}'. Valid options are: {valid_categories}"
            )
        # Filtra proveedores que contengan esa categoría en su lista de categorías.
        documents = [doc for doc in documents if category_value in doc.get("categories", [])]

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
    country: Country | None = Query(None),
    category: Category | None = Query(None)
):
    return filter_suppliers(country=country.value if country else None, category=category.value if category else None)


# GET /suppliers/by-category?category=Y
@router.get("/by-category")
def get_suppliers_by_category(category: str = Query(...)):
    # Backward-compatible alias for clients already using this route.
    return filter_suppliers(category=category)

# PATCH /suppliers/{id}/status
@router.patch("/{supplier_id}/status")
def update_supplier_status(supplier_id: int, payload: SupplierStatusPatch):
    new_status_value = payload.status.value

    existing_supplier = suppliers_table.get(doc_id=supplier_id)

    if existing_supplier is None:
        raise HTTPException(
            status_code=404,
            detail=f"Supplier with id {supplier_id} not found"
        )

    suppliers_table.update(
        {
            "status": new_status_value,
            "updated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        },
        doc_ids=[supplier_id]
    )

    updated_supplier = suppliers_table.get(doc_id=supplier_id)

    return serialize_document(updated_supplier)



# PATCH /suppliers/{id}/rate
@router.patch("/{supplier_id}/rate")
def update_supplier_rate(supplier_id: int, payload: SupplierRatePatch):
  
    existing_supplier = suppliers_table.get(doc_id=supplier_id)

    if existing_supplier is None:
        raise HTTPException(
            status_code=404,
            detail=f"Supplier with id {supplier_id} not found"
        )

    suppliers_table.update(
        {
            "monthly_rate": payload.monthly_rate,
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