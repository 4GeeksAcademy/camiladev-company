from datetime import datetime, timedelta, timezone
from unittest.mock import Mock

import pytest
from fastapi import HTTPException
from jose import JWTError, jwt

from routes import auth


def test_token_authenticates_its_owner(user):
    token = auth.create_access_token(user["id"])
    claims = jwt.decode(token, auth.JWT_SECRET, algorithms=[auth.ALGORITHM])
    assert claims["sub"] == user["id"]
    assert 0 < claims["exp"] - datetime.now(timezone.utc).timestamp() <= 1800
    assert auth.get_current_user(token) == user


@pytest.mark.parametrize("subject", [None, "", 42])
def test_invalid_subject_cannot_authenticate(subject):
    payload = {} if subject is None else {"sub": subject}
    token = jwt.encode(payload, auth.JWT_SECRET, algorithm=auth.ALGORITHM)
    with pytest.raises(HTTPException, match="Token inválido o expirado"):
        auth.get_current_user(token)


@pytest.mark.parametrize("token", ["", "not-a-jwt", "a.b.c"])
def test_malformed_token_cannot_authenticate(token):
    with pytest.raises(HTTPException, match="Token inválido o expirado"):
        auth.get_current_user(token)


def test_expired_token_cannot_authenticate(user):
    token = jwt.encode(
        {"sub": user["id"], "exp": datetime.now(timezone.utc) - timedelta(seconds=1)},
        auth.JWT_SECRET, algorithm=auth.ALGORITHM,
    )
    with pytest.raises(HTTPException, match="Token inválido o expirado"):
        auth.get_current_user(token)


def test_wrong_signature_cannot_authenticate(user):
    token = jwt.encode({"sub": user["id"]}, "another-secret", algorithm=auth.ALGORITHM)
    with pytest.raises(HTTPException, match="Token inválido o expirado"):
        auth.get_current_user(token)


def test_deleted_user_cannot_authenticate():
    with pytest.raises(HTTPException, match="Usuario no válido"):
        auth.get_current_user(auth.create_access_token("deleted-user"))


@pytest.mark.parametrize("operation", [auth.create_access_token, auth.get_current_user])
def test_missing_secret_is_a_configuration_failure(monkeypatch, operation):
    monkeypatch.setattr(auth, "JWT_SECRET", None)
    with pytest.raises(HTTPException) as error:
        operation("value")
    assert error.value.status_code == 500


@pytest.mark.parametrize("failure", [JWTError("private"), TypeError("private"), ValueError("private")])
def test_signing_failure_is_not_exposed(monkeypatch, failure):
    monkeypatch.setattr(auth.jwt, "encode", Mock(side_effect=failure))
    with pytest.raises(HTTPException, match="No se pudo iniciar sesión"):
        auth.create_access_token("user")


@pytest.mark.parametrize("failure", [TypeError("private"), ValueError("private")])
def test_decoder_configuration_failure_is_not_exposed(monkeypatch, failure):
    monkeypatch.setattr(auth.jwt, "decode", Mock(side_effect=failure))
    with pytest.raises(HTTPException, match="No se pudo validar la sesión"):
        auth.get_current_user("token")