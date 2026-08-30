from datetime import date, datetime, timezone
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field



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