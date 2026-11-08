import logging
from json import JSONDecodeError

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from tinydb.storages import JSONStorage


logger = logging.getLogger(__name__)


class SafeJSONStorage(JSONStorage):
    def read(self):
        try:
            return super().read()
        except (OSError, JSONDecodeError, UnicodeError):
            logger.error("Database read failed")
            raise HTTPException(500, "No se pudieron leer los datos.") from None

    def write(self, data):
        try:
            return super().write(data)
        except (OSError, TypeError, ValueError):
            logger.error("Database write failed")
            raise HTTPException(500, "No se pudieron guardar los datos.") from None


def configure_error_handlers(app: FastAPI):
    @app.exception_handler(StarletteHTTPException)
    async def http_error(_request: Request, error: StarletteHTTPException):
        detail = error.detail if error.status_code < 500 else "No se pudo completar la solicitud."
        return JSONResponse(
            status_code=error.status_code,
            content={"detail": detail},
            headers=error.headers,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error(_request: Request, error: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={"detail": [
                {"loc": list(issue["loc"]), "msg": "Valor no válido.", "type": issue["type"]}
                for issue in error.errors()
            ]},
        )

    @app.exception_handler(Exception)
    async def unexpected_error(_request: Request, _error: Exception):
        logger.error("Unhandled request failure")
        return JSONResponse(
            status_code=500,
            content={"detail": "No se pudo completar la solicitud."},
        )