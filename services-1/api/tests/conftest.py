import sys
from types import ModuleType
from unittest.mock import Mock

import pytest
from tinydb import TinyDB
from tinydb.storages import MemoryStorage


database = ModuleType("database")
database.db = TinyDB(storage=MemoryStorage)
for table_name in ("users", "profiles", "password_reset_tokens"):
    setattr(database, f"{table_name}_table", database.db.table(table_name))
sys.modules["database"] = database

import services
from routes import auth
from routes.users import UserCreate, register


@pytest.fixture(autouse=True)
def isolated_dependencies(monkeypatch):
    with TinyDB(storage=MemoryStorage) as storage:
        for table_name in ("users", "profiles", "password_reset_tokens"):
            monkeypatch.setattr(
                services, f"{table_name}_table", storage.table(table_name)
            )
        monkeypatch.setattr(auth, "JWT_SECRET", "unit-test-secret-not-for-production")
        monkeypatch.setattr(auth, "ACCESS_TOKEN_EXPIRE_MINUTES", 30)
        monkeypatch.setattr(auth, "send_password_reset_email", Mock())
        monkeypatch.setenv("FRONTEND_URL", "https://frontend.example/")
        yield


@pytest.fixture
def user():
    result = register(UserCreate(email="user@example.com", password="valid-password"))
    return services.get_user_by_id(result["user"]["id"])