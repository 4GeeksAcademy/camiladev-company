#!/usr/bin/env python3
"""Import historical customer incidents from the analyzer CSV, idempotently."""

import argparse
import csv
from pathlib import Path
import sys

from sqlalchemy import select
from sqlmodel import SQLModel, Session

REPO_ROOT = Path(__file__).resolve().parents[1]
SERVICES_DIR = REPO_ROOT / "services"
SHARED_DIR = REPO_ROOT / "packages" / "shared"
CSV_PATH = REPO_ROOT / "content" / "contexts" / "incidents-file-analysis" / "incidents-nexova.csv"

sys.path.insert(0, str(SERVICES_DIR))
sys.path.insert(0, str(SHARED_DIR))

from models import Incident, IncidentSeedSource  # noqa: E402
from incident_seed_validation import transform_incident_row  # noqa: E402


def load_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", newline="", encoding="utf-8-sig") as csv_file:
        reader = csv.DictReader(csv_file)
        if not reader.fieldnames:
            raise ValueError("CSV is empty or has no header row")
        return list(reader)


def seed_incidents(csv_path: Path = CSV_PATH, db_engine=None) -> dict[str, int]:
    if db_engine is None:
        from database import engine as db_engine

    rows = load_csv(csv_path)
    inserted = skipped = invalid = 0
    invalid_rows: list[tuple[int, str]] = []
    seen_source_keys: set[str] = set()

    SQLModel.metadata.create_all(
        db_engine,
        tables=[Incident.__table__, IncidentSeedSource.__table__],
    )

    with Session(db_engine) as session:
        with session.begin():
            for row_number, row in enumerate(rows, start=2):
                try:
                    payload, source_key = transform_incident_row(row)
                except (TypeError, ValueError) as error:
                    invalid += 1
                    invalid_rows.append((row_number, str(error)))
                    continue

                if source_key in seen_source_keys:
                    skipped += 1
                    continue
                seen_source_keys.add(source_key)

                if session.get(IncidentSeedSource, source_key) is not None:
                    skipped += 1
                    continue

                # Fallback identities also prevent duplicates if the source lacks ticket_id.
                existing_fallback = None
                if not (isinstance(row.get("ticket_id"), str) and row["ticket_id"].strip()):
                    existing_fallback = session.exec(
                        select(Incident.id).where(
                            Incident.title == payload["title"],
                            Incident.created_at == payload["created_at"],
                        )
                    ).first()
                if existing_fallback is not None:
                    session.add(IncidentSeedSource(source_key=source_key, incident_id=existing_fallback))
                    skipped += 1
                    continue

                incident = Incident(**payload)
                session.add(incident)
                session.flush()
                session.add(IncidentSeedSource(source_key=source_key, incident_id=incident.id))
                inserted += 1

    return {"total": len(rows), "inserted": inserted, "skipped": skipped, "invalid": invalid, "invalid_rows": invalid_rows}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", type=Path, default=CSV_PATH, help="Path to historical CSV")
    args = parser.parse_args()
    if not args.csv.is_file():
        parser.error(f"CSV not found: {args.csv}")

    try:
        result = seed_incidents(args.csv)
    except Exception:
        parser.exit(1, "Incident seed failed; check database connectivity and schema. No partial transaction was committed.\n")

    print(
        "Historical incident seed complete: "
        f"{result['inserted']} inserted, {result['skipped']} already present, "
        f"{result['invalid']} invalid of {result['total']} rows."
    )
    if result["invalid_rows"]:
        print("Invalid rows:")
        for row_number, reason in result["invalid_rows"]:
            print(f"  CSV row {row_number}: {reason}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
