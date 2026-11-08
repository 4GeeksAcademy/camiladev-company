from fastapi import FastAPI

from errors import configure_error_handlers
from routes.suppliers import router as suppliers_router


app = FastAPI()
configure_error_handlers(app)

app.include_router(suppliers_router)


@app.get("/")
def health_check():
    return {"message": "API working"}

    