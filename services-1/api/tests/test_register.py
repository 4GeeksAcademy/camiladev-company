import pytest
from fastapi import HTTPException

import services
from routes.auth import verify_password
from routes.users import UserCreate, register


def test_register_creates_user_and_profile():
    result = register(UserCreate(email="new@example.com", password="secret", name="Camila"))
    stored = services.get_user_by_id(result["user"]["id"])
    assert verify_password("secret", stored["hashed_password"])
    assert stored["hashed_password"] != "secret"
    assert result["user"]["role"] == "user"
    assert result["user"]["is_active"] is True
    assert "hashed_password" not in result["user"]
    assert result["profile"] == services.get_profile_by_user_id(stored["id"])
    assert result["profile"]["name"] == "Camila"


def test_optional_profile_and_maximum_password():
    result = register(UserCreate(email="new@example.com", password="a" * 72))
    assert result["profile"]["name"] is None
    assert result["profile"]["phone"] is None
    assert result["profile"]["address"] is None
    assert verify_password("a" * 72, services.get_user_by_id(result["user"]["id"])["hashed_password"])


def test_duplicate_email_creates_no_extra_records(user):
    with pytest.raises(HTTPException, match="ya está registrado"):
        register(UserCreate(email=user["email"], password="another-password"))
    assert services.get_all_users() == [user]
    assert len(services.profiles_table) == 1


def test_oversized_password_creates_no_records():
    with pytest.raises(HTTPException, match="longitud permitida"):
        register(UserCreate(email="new@example.com", password="a" * 73))
    assert services.get_all_users() == []
    assert len(services.profiles_table) == 0


def test_empty_credentials_are_currently_accepted():
    result = register(UserCreate(email="", password=""))
    stored = services.get_user_by_id(result["user"]["id"])
    assert stored["email"] == ""
    assert verify_password("", stored["hashed_password"])