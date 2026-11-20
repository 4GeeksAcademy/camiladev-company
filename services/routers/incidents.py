from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, func, select

from database import get_db
from models import (
    Incident,
    IncidentBranch,
    IncidentCategory,
    IncidentOrigin,
    IncidentStatus,
)
from routes.auth import get_current_user
from schemas import IncidentCreate, IncidentRead, IncidentStatusPatch


router = APIRouter(prefix="/api/incidents", tags=["incidents"])


VALID_STATUS_TRANSITIONS = {
    IncidentStatus.open: {IncidentStatus.in_progress, IncidentStatus.discarded},
    IncidentStatus.in_progress: {IncidentStatus.resolved, IncidentStatus.discarded},
    IncidentStatus.resolved: set(),
    IncidentStatus.discarded: set(),
}


def incident_user(current_user: dict = Depends(get_current_user)):
    """Require a valid, active backoffice account for every incident endpoint."""
    if not current_user.get("is_active"):
        raise HTTPException(status_code=403, detail="Inactive user.")
    return current_user


@router.post("", response_model=IncidentRead, status_code=201)
def create_incident(
    data: IncidentCreate,
    _current_user: dict = Depends(incident_user),
    session: Session = Depends(get_db),
):
    incident = Incident(**data.model_dump())
    session.add(incident)
    session.commit()
    session.refresh(incident)
    return incident


@router.get("", response_model=list[IncidentRead])
def list_incidents(
    status: IncidentStatus | None = Query(default=None),
    origin: IncidentOrigin | None = Query(default=None),
    branch: IncidentBranch | None = Query(default=None),
    category: IncidentCategory | None = Query(default=None),
    _current_user: dict = Depends(incident_user),
    session: Session = Depends(get_db),
):
    statement = select(Incident).order_by(Incident.id)
    if status is not None:
        statement = statement.where(Incident.status == status)
    if origin is not None:
        statement = statement.where(Incident.origin == origin)
    if branch is not None:
        statement = statement.where(Incident.branch == branch)
    if category is not None:
        statement = statement.where(Incident.category == category)
    return session.exec(statement).all()


@router.get("/summary")
def incident_summary(
    _current_user: dict = Depends(incident_user),
    session: Session = Depends(get_db),
):
    def count_by(field, values):
        rows = session.exec(
            select(field, func.count(Incident.id)).group_by(field)
        ).all()
        counts = {value: count for value, count in rows}
        return {value.value: counts.get(value, 0) for value in values}

    return {
        "total": session.exec(select(func.count(Incident.id))).one(),
        "by_status": count_by(Incident.status, IncidentStatus),
        "by_category": count_by(Incident.category, IncidentCategory),
        "by_origin": count_by(Incident.origin, IncidentOrigin),
        "by_branch": count_by(Incident.branch, IncidentBranch),
    }


@router.get("/{incident_id}", response_model=IncidentRead)
def get_incident(
    incident_id: int,
    _current_user: dict = Depends(incident_user),
    session: Session = Depends(get_db),
):
    incident = session.get(Incident, incident_id)
    if incident is None:
        raise HTTPException(status_code=400, detail="Incident not found.")
    return incident


@router.patch("/{incident_id}/status", response_model=IncidentRead)
def update_incident_status(
    incident_id: int,
    data: IncidentStatusPatch,
    _current_user: dict = Depends(incident_user),
    session: Session = Depends(get_db),
):
    incident = session.get(Incident, incident_id)
    if incident is None:
        raise HTTPException(status_code=400, detail="Incident not found.")

    allowed = VALID_STATUS_TRANSITIONS[incident.status]
    if data.status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status transition: {incident.status.value} -> {data.status.value}.",
        )

    incident.status = data.status
    session.add(incident)
    session.commit()
    session.refresh(incident)
    return incident
