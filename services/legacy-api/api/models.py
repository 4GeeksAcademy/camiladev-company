from datetime import date, datetime, timezone
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field

from typing import List


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
    monthly_rate: float = Field(gt=0)  # Número real con decimales, debe ser > 0
    currency: Currency
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))  # Timestamp de última actualización
    status: Status
    contract_renewal_date: date | None = None  # Formato YYYY-MM-DD
    contact_email: str | None = None
    notes: str | None = None

    
class SupplierStatusPatch(BaseModel):
    status: Status

class SupplierRatePatch(BaseModel):
    monthly_rate: float = Field(gt=0)

class SupplierRead(Suppliers):
    id: int
    

    

    






