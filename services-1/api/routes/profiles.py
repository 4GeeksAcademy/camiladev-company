from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from routes.auth import get_current_user
from services import (
    get_profile_by_user_id,
    update_profile
)


router = APIRouter(
    prefix="/profiles",
    tags=["profiles"]
)


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


@router.get("/me")
def get_my_profile(
    current_user: dict = Depends(get_current_user)
):
    profile = get_profile_by_user_id(
        current_user["id"]
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Perfil no encontrado"
        )

    return profile


@router.put("/me")
def edit_my_profile(
    data: ProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    if not get_profile_by_user_id(current_user["id"]):
        raise HTTPException(404, "Perfil no encontrado")

    changes = data.model_dump(
        exclude_none=True
    )

    profile = update_profile(
        current_user["id"],
        changes
    )

    if not profile:
        raise HTTPException(404, "Perfil no encontrado")

    return profile