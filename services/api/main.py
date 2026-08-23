from fastapi import FastAPI

from routes.suppliers import router as suppliers_router


app = FastAPI()

app.include_router(suppliers_router)


@app.get("/")
def health_check():
    return {"message": "API working"}

    