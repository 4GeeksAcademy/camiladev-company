from unittest.mock import Mock

import pytest

import services
from routes import auth


def test_me_returns_own_identity_and_profile(user):
    result = auth.get_me(user)
    assert result == {
        "id": user["id"], "email": user["email"], "role": "user",
        "profile": services.get_profile_by_user_id(user["id"]),
    }
    assert "hashed_password" not in result


def test_me_handles_missing_profile(user):
    services.profiles_table.truncate()
    assert auth.get_me(user)["profile"] is None


def test_me_does_not_hide_storage_failure(user, monkeypatch):
    monkeypatch.setattr(auth, "get_profile_by_user_id", Mock(side_effect=RuntimeError("storage unavailable")))
    with pytest.raises(RuntimeError, match="storage unavailable"):
        auth.get_me(user)