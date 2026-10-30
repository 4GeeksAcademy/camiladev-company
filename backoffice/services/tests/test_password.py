from unittest.mock import Mock

import pytest
from fastapi import HTTPException

from routes import auth


def test_password_hash_is_salted_and_verifiable():
    first = auth.hash_password("secret")
    second = auth.hash_password("secret")
    assert first != second
    assert auth.verify_password("secret", first)
    assert not auth.verify_password("wrong", first)


@pytest.mark.parametrize("password", ["a" * 72, "\u00e9" * 36])
def test_bcrypt_accepts_exactly_72_utf8_bytes(password):
    assert auth.verify_password(password, auth.hash_password(password))


@pytest.mark.parametrize("password", ["a" * 73, "\u00e9" * 37])
def test_bcrypt_rejects_more_than_72_utf8_bytes(password):
    with pytest.raises(HTTPException, match="longitud permitida"):
        auth.hash_password(password)
    assert auth.verify_password(password, "irrelevant") is False


def test_corrupt_stored_hash_is_reported_safely():
    with pytest.raises(HTTPException, match="No se pudo validar la contraseña"):
        auth.verify_password("secret", "corrupt-hash")


@pytest.mark.parametrize("failure", [ValueError("private"), TypeError("private")])
def test_hash_provider_failure_is_reported_safely(monkeypatch, failure):
    monkeypatch.setattr(auth.bcrypt, "hash", Mock(side_effect=failure))
    with pytest.raises(HTTPException, match="No se pudo procesar la contraseña"):
        auth.hash_password("secret")