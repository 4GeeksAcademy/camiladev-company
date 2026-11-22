from cache import TTLCache


def test_cache_returns_copy_until_ttl_expires():
    now = [10.0]
    cache = TTLCache(clock=lambda: now[0])
    calls = []

    def load():
        calls.append("load")
        return [{"value": 1}]

    first = cache.get_or_set("items", "all", 5, load)
    first[0]["value"] = 99
    assert cache.get_or_set("items", "all", 5, load) == [{"value": 1}]
    assert len(calls) == 1

    now[0] = 15.0
    assert cache.get_or_set("items", "all", 5, load) == [{"value": 1}]
    assert len(calls) == 2


def test_invalidation_is_namespace_scoped():
    cache = TTLCache(clock=lambda: 1.0)
    calls = {"suppliers": 0, "products": 0}

    def supplier_loader():
        calls["suppliers"] += 1
        return calls["suppliers"]

    def product_loader():
        calls["products"] += 1
        return calls["products"]

    assert cache.get_or_set("suppliers", "all", 60, supplier_loader) == 1
    assert cache.get_or_set("products", "all", 60, product_loader) == 1
    cache.invalidate("suppliers")

    assert cache.get_or_set("suppliers", "all", 60, supplier_loader) == 2
    assert cache.get_or_set("products", "all", 60, product_loader) == 1


def test_failed_load_is_not_cached():
    cache = TTLCache(clock=lambda: 1.0)
    calls = []

    def fail_once():
        calls.append("called")
        if len(calls) == 1:
            raise RuntimeError("temporary failure")
        return "ok"

    try:
        cache.get_or_set("items", "all", 60, fail_once)
    except RuntimeError:
        pass
    else:
        raise AssertionError("loader error should propagate")

    assert cache.get_or_set("items", "all", 60, fail_once) == "ok"
    assert len(calls) == 2
