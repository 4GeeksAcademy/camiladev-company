from datetime import datetime, timedelta, timezone

import pytest
from fastapi import HTTPException

import services
from routes import auth


def test_change_password_updates_hash_and_invalidates_reset_links(user):
    services.create_password_reset_token(user["id"], "old-token", (datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat())
    auth.change_password(auth.ChangePasswordRequest(current_password="valid-password", new_password="new-password"), user)
    stored = services.get_user_by_id(user["id"])
    assert auth.verify_password("new-password", stored["hashed_password"])
    assert not auth.verify_password("valid-password", stored["hashed_password"])
    assert len(services.password_reset_tokens_table) == 0


def test_maximum_password_without_previous_links(user):
    auth.change_password(auth.ChangePasswordRequest(current_password="valid-password", new_password="a" * 72), user)
    assert auth.verify_password("a" * 72, services.get_user_by_id(user["id"])["hashed_password"])


@pytest.mark.parametrize("current,new,reason", [
    ("wrong", "new-password", "actual es incorrecta"),
    ("", "new-password", "actual es incorrecta"),
    ("valid-password", "a" * 73, "longitud permitida"),
])
def test_rejected_change_preserves_password_and_reset_links(user, current, new, reason):
    services.create_password_reset_token(user["id"], "old-token", "2099-01-01T00:00:00+00:00")
    with pytest.raises(HTTPException, match=reason):
        auth.change_password(auth.ChangePasswordRequest(current_password=current, new_password=new), user)
    assert services.get_user_by_id(user["id"]) == user
    assert len(services.password_reset_tokens_table) == 1