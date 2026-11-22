import sys
from types import ModuleType
from unittest.mock import Mock

from tinydb import TinyDB
from tinydb.storages import MemoryStorage

from cache import api_cache


def test_supplier_list_reuses_entries_and_create_invalidates(monkeypatch):
    database = ModuleType("database")
    database.suppliers_table = TinyDB(storage=MemoryStorage).table("suppliers")
    monkeypatch.setitem(sys.modules, "database", database)

    from routes import suppliers

    monkeypatch.setattr(suppliers, "suppliers_table", database.suppliers_table)
    api_cache.invalidate("suppliers")
    loader = Mock(wraps=suppliers._load_suppliers)
    monkeypatch.setattr(suppliers, "_load_suppliers", loader)

    assert suppliers.filter_suppliers() == []
    assert suppliers.filter_suppliers() == []
    loader.assert_called_once_with(None, None)

    from models import Suppliers

    supplier = Suppliers(
        name="Cache test",
        country="Spain",
        categories=["ats_software"],
        monthly_rate=20,
        currency="EUR",
        status="active",
    )
    suppliers.create_suppliers(supplier)

    assert len(suppliers.filter_suppliers()) == 1
    assert loader.call_count == 2
    api_cache.invalidate("suppliers")


def test_category_alias_shares_cache_entry(monkeypatch):
    database = ModuleType("database")
    database.suppliers_table = TinyDB(storage=MemoryStorage).table("suppliers")
    monkeypatch.setitem(sys.modules, "database", database)

    from routes import suppliers

    monkeypatch.setattr(suppliers, "suppliers_table", database.suppliers_table)
    api_cache.invalidate("suppliers")
    loader = Mock(wraps=suppliers._load_suppliers)
    monkeypatch.setattr(suppliers, "_load_suppliers", loader)

    suppliers.filter_suppliers(category="ats_software")
    suppliers.get_suppliers_by_category(category="ats_software")

    loader.assert_called_once_with(None, "ats_software")
    api_cache.invalidate("suppliers")