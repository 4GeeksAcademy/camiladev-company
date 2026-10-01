from datetime import datetime, timezone

from tinydb import Query

from models import User, Profile
from database import users_table, profiles_table, password_reset_tokens_table

User = Query()
Profile = Query()
ResetToken = Query()


def get_user_by_id(user_id: str):
    return users_table.get(
        User.id == user_id
    )


def get_user_by_email(email: str):
    return users_table.get(
        User.email == email
    )


def get_all_users():
    return users_table.all()


def create_user(user: dict, profile: dict):
    users_table.insert(user)
    profiles_table.insert(profile)

    return user


def update_user(user_id: str, changes: dict):
    users_table.update(
        changes,
        User.id == user_id
    )

    return get_user_by_id(user_id)


def invalidate_password_reset_tokens(user_id: str):
    password_reset_tokens_table.remove(ResetToken.user_id == user_id)


def create_password_reset_token(user_id: str, token_hash: str, expires_at: str):
    password_reset_tokens_table.insert({
        "user_id": user_id,
        "token_hash": token_hash,
        "expires_at": expires_at,
    })


def consume_password_reset_token(token_hash: str):
    records = password_reset_tokens_table.search(
        ResetToken.token_hash == token_hash
    )

    if not records:
        return None

    record = records[0]

    try:
        expires_at = datetime.fromisoformat(record["expires_at"])
    except (KeyError, TypeError, ValueError):
        password_reset_tokens_table.remove(ResetToken.token_hash == token_hash)
        return None

    if expires_at <= datetime.now(timezone.utc):
        password_reset_tokens_table.remove(ResetToken.token_hash == token_hash)
        return None

    removed = password_reset_tokens_table.remove(
        ResetToken.token_hash == token_hash
    )

    return record if removed else None


def delete_user(user_id: str):
    users_table.remove(
        User.id == user_id
    )

    profiles_table.remove(
        Profile.user_id == user_id
    )


def get_profile_by_user_id(user_id: str):
    return profiles_table.get(
        Profile.user_id == user_id
    )


def update_profile(user_id: str, changes: dict):
    profiles_table.update(
        changes,
        Profile.user_id == user_id
    )

    return get_profile_by_user_id(user_id)