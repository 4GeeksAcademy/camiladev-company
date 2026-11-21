from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict

from email_validation import NormalizedEmail
from routes.auth import get_current_user, hash_password
from services import (
    create_user,
    delete_user,
    get_all_users,
    get_profile_by_user_id,
    get_user_by_email,
    get_user_by_id,
    update_user
)
from schemas import MessageRead, ProfileRead


router = APIRouter(
    prefix="/users",
    tags=["users"]
)


class Role(str, Enum):
    admin = "admin"
    manager = "manager"
    user = "user"


class UserCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: NormalizedEmail
    password: str
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class UserUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: Optional[NormalizedEmail] = None
    password: Optional[str] = None
    role: Optional[Role] = None
    is_active: Optional[bool] = None


class PublicUserRead(BaseModel):
    id: str
    email: str
    is_active: bool
    role: Role
    created_at: datetime


class UserRegistrationRead(BaseModel):
    user: PublicUserRead
    profile: ProfileRead


def public_user(user: dict):
    return {
        "id": user["id"],
        "email": user["email"],
        "is_active": user["is_active"],
        "role": user["role"],
        "created_at": user["created_at"]
    }


def owner_or_admin(
    user_id: str,
    current_user: dict
):
    if (
        current_user["id"] != user_id
        and current_user["role"] != "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="No tenés permiso"
        )


@router.post("", response_model=UserRegistrationRead)
def register(data: UserCreate):

    if get_user_by_email(data.email):
        raise HTTPException(
            status_code=400,
            detail="El email ya está registrado"
        )

    user_id = str(uuid4())

    user = {
        "id": user_id,
        "email": data.email,

        # bcrypt genera y guarda el hash.
        "hashed_password": hash_password(data.password),

        "is_active": True,
        "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    profile = {
        "id": str(uuid4()),
        "user_id": user_id,
        "name": data.name,
        "phone": data.phone,
        "address": data.address
    }

    create_user(
        user,
        profile
    )

    return {
        "user": public_user(user),
        "profile": profile
    }


@router.get("", response_model=list[PublicUserRead])
def list_users(
    current_user: dict = Depends(get_current_user)
):
    return [
        public_user(user)
        for user in get_all_users()
    ]


@router.get("/{user_id}", response_model=PublicUserRead)
def get_user(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    owner_or_admin(
        user_id,
        current_user
    )

    user = get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    return public_user(user)


@router.put("/{user_id}", response_model=PublicUserRead)
def edit_user(
    user_id: str,
    data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    owner_or_admin(
        user_id,
        current_user
    )

    if not get_user_by_id(user_id):
        raise HTTPException(404, "Usuario no encontrado")

    changes = data.model_dump(
        exclude_none=True
    )

    if "email" in changes:
        existing_user = get_user_by_email(
            changes["email"]
        )

        if (
            existing_user
            and existing_user["id"] != user_id
        ):
            raise HTTPException(
                status_code=400,
                detail="El email ya está registrado"
            )

    if "password" in changes:
        changes["hashed_password"] = hash_password(
            changes.pop("password")
        )

    if "role" in changes:

        if current_user["role"] != "admin":
            raise HTTPException(
                status_code=403,
                detail="Solo un admin puede cambiar roles"
            )

        changes["role"] = changes["role"].value

    user = update_user(
        user_id,
        changes
    )

    if not user:
        raise HTTPException(404, "Usuario no encontrado")

    return public_user(user)


@router.delete("/{user_id}", response_model=MessageRead)
def remove_user(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    owner_or_admin(
        user_id,
        current_user
    )

    if not get_user_by_id(user_id):
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    delete_user(user_id)

    return {
        "message": "Usuario eliminado"
    }