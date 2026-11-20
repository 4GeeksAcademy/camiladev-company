from datetime import date, datetime, timezone
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field
from typing import List
from sqlalchemy import CheckConstraint
from sqlmodel import DateTime, SQLModel, Field as ORMField



class UserRole(str, Enum):
    admin = "admin"
    manager = "manager"
    user = "user"

class User(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    email: str
    hashed_password: str
    is_active: bool
    role: UserRole
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Profile(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    user_id: str
    name: str
    phone: str
    address: str


class Category(str, Enum):
    job_boards = "job_boards"
    ats_software = "ats_software"
    assessment_tools = "assessment_tools"
    training_platforms = "training_platforms"
    payroll_and_hr_software = "payroll_and_hr_software"
    video_interview = "video_interview"
    background_check = "background_check"
    office_and_facilities = "office_and_facilities"
    it_and_software_licenses = "it_and_software_licenses"


class Currency(str, Enum):
    EUR = "EUR"
    USD = "USD"


class Status(str, Enum):
    active = "active"
    suspended = "suspended"


class Country(str, Enum):
    Spain = "Spain"
    USA = "USA"


class Suppliers(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    country: Country
    categories: List[Category] = Field(min_length=1)
    monthly_rate: float = Field(gt=0)
    currency: Currency
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: Status
    contract_renewal_date: date | None = None
    contact_email: str | None = None
    notes: str | None = None


class SupplierStatusPatch(BaseModel):
    status: Status


class SupplierRatePatch(BaseModel):
    monthly_rate: float = Field(gt=0)


class SupplierRead(Suppliers):
    id: int


class AssetCategory(str, Enum):
    hardware = "hardware"
    peripherals = "peripherals"
    office_supplies = "office_supplies"
    training_materials = "training_materials"


class Office(str, Enum):
    Valencia = "Valencia"
    Miami = "Miami"


class ExitType(str, Enum):
    allocation = "allocation"
    consumption = "consumption"


class Asset(SQLModel, table=True):
    id: int | None = ORMField(default=None, primary_key=True)
    name: str = ORMField(min_length=1)
    sku: str = ORMField(min_length=1, unique=True, index=True)
    category: AssetCategory
    office: Office = ORMField(index=True)


class AssetEntry(SQLModel, table=True):
    id: int | None = ORMField(default=None, primary_key=True)
    asset_id: int = ORMField(foreign_key="asset.id", index=True)
    quantity: int = ORMField(gt=0)
    supplier: str = ORMField(min_length=1)
    office: Office = ORMField(index=True)
    created_at: datetime = ORMField(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True),
    )
    user_uuid: str


class AssetExit(SQLModel, table=True):
    id: int | None = ORMField(default=None, primary_key=True)
    asset_id: int = ORMField(foreign_key="asset.id", index=True)
    quantity: int = ORMField(gt=0)
    exit_type: ExitType
    assigned_to: str | None = None
    office: Office = ORMField(index=True)
    created_at: datetime = ORMField(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True),
    )
    user_uuid: str


class IncidentCategory(str, Enum):
    technical_failure = "technical_failure"
    process_error = "process_error"
    client_complaint = "client_complaint"
    candidate_issue = "candidate_issue"
    staff_issue = "staff_issue"
    sla_breach = "sla_breach"
    data_quality = "data_quality"
    other = "other"


class IncidentStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    discarded = "discarded"


class IncidentOrigin(str, Enum):
    customer = "customer"
    branch = "branch"
    internal = "internal"


class IncidentBranch(str, Enum):
    central = "central"
    valencia_operations = "valencia_operations"
    miami_office = "miami_office"
    remote = "remote"


class Incident(SQLModel, table=True):
    __table_args__ = (
        CheckConstraint("length(trim(title)) > 0", name="ck_incident_title_nonempty"),
        CheckConstraint("length(trim(description)) > 0", name="ck_incident_description_nonempty"),
        CheckConstraint(
            "category IN ('technical_failure', 'process_error', 'client_complaint', "
            "'candidate_issue', 'staff_issue', 'sla_breach', 'data_quality', 'other')",
            name="ck_incident_category_allowed",
        ),
        CheckConstraint(
            "status IN ('open', 'in_progress', 'resolved', 'discarded')",
            name="ck_incident_status_allowed",
        ),
        CheckConstraint(
            "origin IN ('customer', 'branch', 'internal')",
            name="ck_incident_origin_allowed",
        ),
        CheckConstraint(
            "branch IN ('central', 'valencia_operations', 'miami_office', 'remote')",
            name="ck_incident_branch_allowed",
        ),
    )

    id: int | None = ORMField(default=None, primary_key=True)
    title: str = ORMField(min_length=1)
    description: str = ORMField(min_length=1)
    category: IncidentCategory
    status: IncidentStatus = ORMField(default=IncidentStatus.open)
    origin: IncidentOrigin
    branch: IncidentBranch
    created_at: datetime = ORMField(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True),
    )
    updated_at: datetime = ORMField(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )


class IncidentSeedSource(SQLModel, table=True):
    """Tracks imported source identities without adding them to Incident."""

    source_key: str = ORMField(primary_key=True)
    incident_id: int = ORMField(foreign_key="incident.id", unique=True, index=True)
