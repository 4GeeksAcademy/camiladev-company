"""Small process-local TTL cache for non-sensitive API read models."""

from copy import deepcopy
from threading import RLock
from time import monotonic
from typing import Callable, TypeVar

T = TypeVar("T")


class TTLCache:
    def __init__(self, clock: Callable[[], float] = monotonic):
        self._clock = clock
        self._entries: dict[tuple[str, str], tuple[float, object]] = {}
        self._generations: dict[str, int] = {}
        self._lock = RLock()

    def get_or_set(
        self, namespace: str, key: str, ttl_seconds: float, loader: Callable[[], T]
    ) -> T:
        cache_key = (namespace, key)
        now = self._clock()
        with self._lock:
            generation = self._generations.get(namespace, 0)
            entry = self._entries.get(cache_key)
            if entry is not None:
                expires_at, value = entry
                if expires_at > now:
                    return deepcopy(value)
                del self._entries[cache_key]

        # Don't hold the lock while doing I/O. Exceptions are never cached.
        value = loader()
        with self._lock:
            if self._generations.get(namespace, 0) == generation:
                self._entries[cache_key] = (
                    self._clock() + ttl_seconds,
                    deepcopy(value),
                )
        return deepcopy(value)

    def invalidate(self, namespace: str) -> None:
        with self._lock:
            self._generations[namespace] = self._generations.get(namespace, 0) + 1
            for cache_key in tuple(self._entries):
                if cache_key[0] == namespace:
                    del self._entries[cache_key]


api_cache = TTLCache()
