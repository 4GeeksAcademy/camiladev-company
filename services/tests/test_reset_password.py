import hashlib
from datetime import datetime, timedelta, timezone

import pytest
from fastapi import HTTPException

import services
from routes import auth


def save_token(user_id, token="reset-token", expires_at=None):
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    services.create_password_reset_token(
        user_id, token_hash,
        expires_at if expires_at is not None else (datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat(),
    )
    return token_hash


def test_reset_password_updates_hash_and_consumes_token_once(user):
    save_token(user["id"])
    request = auth.ResetPasswordRequest(token="reset-token", new_password="new-password")
    auth.reset_password(request)
    stored = services.get_user_by_id(user["id"])
    assert auth.verify_password("new-password", stored["hashed_password"])
    assert not auth.verify_password("valid-password", stored["hashed_password"])
    assert len(services.password_reset_tokens_table) == 0
    with pytest.raises(HTTPException, match="ya fue utilizado"):
        auth.reset_password(request)


@pytest.mark.parametrize("token", ["", "malformed-token", "unknown-token"])
def test_invalid_token_does_not_change_password(user, token):
    with pytest.raises(HTTPException, match="enlace no es válido"):
        auth.reset_password(auth.ResetPasswordRequest(token=token, new_password="new-password"))
    assert services.get_user_by_id(user["id"]) == user


@pytest.mark.parametrize("expiry", [
    "expired", "not-a-date", "2026-01-01T00:00:00", "", None,
])
def test_expired_or_corrupt_token_is_removed_without_changing_password(user, expiry):
    token_hash = save_token(user["id"])
    if expiry == "expired":
        expiry = (datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat()
    services.password_reset_tokens_table.update({"expires_at": expiry})
    with pytest.raises(HTTPException, match="enlace no es válido"):
        auth.reset_password(auth.ResetPasswordRequest(token="reset-token", new_password="new-password"))
    assert services.get_user_by_id(user["id"]) == user
    assert services.consume_password_reset_token(token_hash) is None
    assert len(services.password_reset_tokens_table) == 0


def test_missing_expiry_is_rejected(user):
    token_hash = hashlib.sha256(b"reset-token").hexdigest()
    services.password_reset_tokens_table.insert({"token_hash": token_hash, "user_id": user["id"]})
    with pytest.raises(HTTPException, match="enlace no es válido"):
        auth.reset_password(auth.ResetPasswordRequest(token="reset-token", new_password="new-password"))
    assert len(services.password_reset_tokens_table) == 0
    assert services.get_user_by_id(user["id"]) == user


def test_token_for_deleted_user_cannot_reset_password():
    save_token("deleted-user")
    with pytest.raises(HTTPException, match="enlace no es válido"):
        auth.reset_password(auth.ResetPasswordRequest(token="reset-token", new_password="new-password"))
    assert len(services.password_reset_tokens_table) == 0


def test_oversized_password_does_not_consume_valid_token(user):
    token_hash = save_token(user["id"])
    with pytest.raises(HTTPException, match="longitud permitida"):
        auth.reset_password(auth.ResetPasswordRequest(token="reset-token", new_password="a" * 73))
    assert services.get_user_by_id(user["id"]) == user
    assert services.consume_password_reset_token(token_hash)["user_id"] == user["id"]