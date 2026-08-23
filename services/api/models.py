from datetime import date, datetime, timezone

from pydantic import BaseModel, ConfigDict, field_validator, Field

from typing import List


VALID_CATEGORIES: List[str] = [
    "job_boards",
    "ats_software",
    "assessment_tools",
    "training_platforms",
    "payroll_and_hr_software",
    "video_interview",
    "background_check",
    "office_and_facilities",
    "it_and_software_licenses"
]

VALID_CURRENCIES: List[str] = ["EUR", "USD"]

VALID_STATUS: List[str] = ["active", "suspended"]

VALID_COUNTRY: List[str] = ["Spain", "USA"]


class Suppliers(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    country: str = Field(min_length=1)
    categories: List[str] = Field(min_length=1)
    monthly_rate: float = Field(gt=0)  # Número real con decimales, debe ser > 0
    currency: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))  # Timestamp de última actualización
    status: str
    contract_renewal_date: date | None = None  # Formato YYYY-MM-DD
    contact_email: str | None = None
    notes: str | None = None

    @field_validator("categories")
    @classmethod
    def validate_categories(cls, value: List[str]) -> List[str]:
        invalid = [cat for cat in value if cat not in VALID_CATEGORIES]
        if invalid:
            raise ValueError(
                f"Invalid categor{'y' if len(invalid) == 1 else 'ies'}: {invalid}. "
                f"Valid options are: {VALID_CATEGORIES}"
            )
        return value

    @field_validator("currency")
    @classmethod
    def validate_currency(cls, value: str) -> str:
        if value not in VALID_CURRENCIES:
            raise ValueError(
                f"Invalid currency '{value}'. Valid options are: {VALID_CURRENCIES}"
            )
        return value

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str) -> str:
        if value not in VALID_STATUS:
            raise ValueError(
                f"Invalid status '{value}'. Valid options are: {VALID_STATUS}"
            )
        return value

    @field_validator("country")
    @classmethod
    def validate_country(cls, value: str) -> str:
        if value not in VALID_COUNTRY:
            raise ValueError(
                f"Invalid country '{value}'. Valid options are: {VALID_COUNTRY}"
            )
        return value







