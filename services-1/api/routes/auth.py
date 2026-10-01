import hashlib
import logging
import os
import secrets
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.hash import bcrypt
from pydantic import BaseModel, EmailStr

from email_service import send_password_reset_email
from services import (
    consume_password_reset_token,
    create_password_reset_token,
    get_profile_by_user_id,
    get_user_by_email,
    get_user_by_id,
    invalidate_password_reset_tokens,
    update_user,
)


load_dotenv()


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

logger = logging.getLogger(__name__)


JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
)
PASSWORD_RESET_EXPIRE_MINUTES = 30


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def create_access_token(user_id: str):
    expiration = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": user_id,
        "exp": expiration
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=ALGORITHM
    )


def get_current_user(
    token: str = Depends(oauth2_scheme)
):
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        user = get_user_by_id(user_id)

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Usuario no válido"
            )

        return user

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token inválido o expirado"
        )


@router.post("/login")
def login(
    form: OAuth2PasswordRequestForm = Depends()
):
    # Swagger llama "username" al campo.
    # Nosotros usamos ese campo para enviar el email.

    user = get_user_by_email(form.username)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Email o contraseña incorrectos"
        )

    if not bcrypt.verify(
        form.password,
        user["hashed_password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Email o contraseña incorrectos"
        )

    token = create_access_token(
        user["id"]
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_me(
    current_user: dict = Depends(get_current_user)
):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "role": current_user["role"],
        "profile": get_profile_by_user_id(
            current_user["id"]
        )
    }


@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest):
    user = get_user_by_email(str(data.email))

    if user:
        token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
        expires_at = datetime.now(timezone.utc) + timedelta(
            minutes=PASSWORD_RESET_EXPIRE_MINUTES
        )
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
        reset_url = f"{frontend_url}/reset-password?token={token}"

        invalidate_password_reset_tokens(user["id"])
        create_password_reset_token(
            user["id"], token_hash, expires_at.isoformat()
        )

        try:
            send_password_reset_email(user["email"], reset_url)
        except Exception as error:
            logger.warning(
                "Password reset email delivery failed (%s, status=%s)",
                type(error).__name__,
                getattr(error, "status_code", getattr(error, "code", "n/a")),
            )
            from database import password_reset_tokens_table
            from tinydb import Query

            password_reset_tokens_table.remove(
                Query().token_hash == token_hash
            )

    return {
        "message": "Si el email está registrado, recibirás un enlace para restablecer tu contraseña."
    }


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest):
    token_hash = hashlib.sha256(data.token.encode("utf-8")).hexdigest()
    reset_record = consume_password_reset_token(token_hash)

    if not reset_record:
        raise HTTPException(
            status_code=400,
            detail="El enlace no es válido, ha caducado o ya fue utilizado.",
        )

    user = get_user_by_id(reset_record["user_id"])

    if not user:
        raise HTTPException(
            status_code=400,
            detail="El enlace no es válido, ha caducado o ya fue utilizado.",
        )

    update_user(user["id"], {"hashed_password": bcrypt.hash(data.new_password)})
    return {"message": "La contraseña se actualizó correctamente."}


@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
):
    if not bcrypt.verify(data.current_password, current_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="La contraseña actual es incorrecta.")

    update_user(
        current_user["id"],
        {"hashed_password": bcrypt.hash(data.new_password)},
    )
    invalidate_password_reset_tokens(current_user["id"])
    return {"message": "La contraseña se actualizó correctamente."}