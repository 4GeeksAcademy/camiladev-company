from typing import Annotated

from pydantic import AfterValidator, EmailStr, TypeAdapter


NormalizedEmail = Annotated[EmailStr, AfterValidator(str.casefold)]
email_adapter = TypeAdapter(NormalizedEmail)


def normalize_email(email: str) -> str:
    return email_adapter.validate_python(email)
