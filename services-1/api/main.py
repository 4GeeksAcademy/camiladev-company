from fastapi import FastAPI

from errors import configure_error_handlers
from routes.auth import router as auth_router
from routes.profiles import router as profiles_router
from routes.users import router as users_router



app = FastAPI(title= "Company API")
configure_error_handlers(app)


app.include_router(users_router)
app.include_router(profiles_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "message": "API funcionando"
    }