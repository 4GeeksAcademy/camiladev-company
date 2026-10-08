from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from routes import auth


def test_login_issues_token_for_valid_credentials(user):
    result = auth.login(SimpleNamespace(username=user["email"], password="valid-password"))
    assert auth.get_current_user(result["access_token"]) == user
    assert result["token_type"] == "bearer"


@pytest.mark.parametrize("email,password", [
    ("", "valid-password"), ("user@example.com", ""),
    ("unknown@example.com", "valid-password"), ("user@example.com", "wrong"),
    ("user@example.com", "a" * 73),
])
def test_invalid_credentials_cannot_issue_token(user, monkeypatch, email, password):
    def unexpected_token_creation(user_id):
        pytest.fail("Invalid credentials must not issue a token")

    monkeypatch.setattr(auth, "create_access_token", unexpected_token_creation)
    with pytest.raises(HTTPException, match="Email o contraseña incorrectos"):
        auth.login(SimpleNamespace(username=email, password=password))


def test_login_fails_without_signing_secret(user, monkeypatch):
    monkeypatch.setattr(auth, "JWT_SECRET", None)
    with pytest.raises(HTTPException, match="No se pudo iniciar sesión"):
        auth.login(SimpleNamespace(username=user["email"], password="valid-password"))