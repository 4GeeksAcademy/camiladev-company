"""CSV-to-Incident validation shared by historical import tooling."""

from datetime import datetime, time, timezone
from hashlib import sha256
from typing import Any


STATUS_MAP = {
    "OPEN": "open",
    "CLOSED": "resolved",
    "DISCARDED": "discarded",
}

CATEGORY_MAP = {
    "TECHNICAL": "technical_failure",
    "BILLING": "process_error",
    "ACCESS": "technical_failure",
    "HR_QUERY": "process_error",
    "COMPLAINT": "client_complaint",
}


def transform_incident_row(row: dict[str, Any]) -> tuple[dict[str, Any], str]:
    """Validate an analyzer CSV row and return its Incident payload and opaque source key."""
    if None in row:
        raise ValueError("row contains more fields than the CSV header")

    description = row.get("description")
    if not isinstance(description, str) or not description.strip():
        raise ValueError("description is required")

    title = description[:120].strip()
    if not title:
        raise ValueError("description must produce a non-empty title")

    raw_date = row.get("date")
    try:
        parsed_date = datetime.strptime(raw_date, "%Y-%m-%d").date()
        if parsed_date.isoformat() != raw_date:
            raise ValueError
        created_at = datetime.combine(parsed_date, time.min, tzinfo=timezone.utc)
    except (TypeError, ValueError):
        raise ValueError("date must use YYYY-MM-DD format")

    raw_status = row.get("status")
    status = STATUS_MAP.get(raw_status.strip().upper()) if isinstance(raw_status, str) else None
    if status is None:
        raise ValueError("status is missing or unsupported")

    raw_category = row.get("category")
    category = CATEGORY_MAP.get(raw_category.strip().upper()) if isinstance(raw_category, str) else None
    if category is None:
        raise ValueError("category is missing or unsupported")

    ticket_id = row.get("ticket_id")
    if isinstance(ticket_id, str) and ticket_id.strip():
        identity = f"ticket_id\0{ticket_id.strip()}"
    else:
        identity = f"title_created_at\0{title}\0{created_at.isoformat()}"

    source_key = sha256(identity.encode("utf-8")).hexdigest()
    return {
        "title": title,
        "description": description,
        "category": category,
        "status": status,
        "origin": "customer",
        # The source CSV has no branch column; BRIEFING.md specifies central.
        "branch": "central",
        "created_at": created_at,
        "updated_at": created_at,
    }, source_key
