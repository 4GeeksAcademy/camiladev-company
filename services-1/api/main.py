from fastapi import FastAPI

from routes.auth import router as auth_router
from routes.profiles import router as profiles_router
from routes.users import router as users_router



app = FastAPI(title= "Company API")


app.include_router(users_router)
app.include_router(profiles_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "message": "API funcionando"
    }