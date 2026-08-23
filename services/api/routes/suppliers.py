from fastapi import APIRouter, HTTPException, Query
from tinydb import Query as TinyDBQuery

from database import suppliers_table
from models import Suppliers, VALID_CATEGORIES, VALID_CURRENCIES, VALID_COUNTRY, VALID_STATUS


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
