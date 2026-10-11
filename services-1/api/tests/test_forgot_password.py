import hashlib
from datetime import datetime, timezone
from urllib.parse import parse_qs, urlparse

from email_service import EmailDeliveryError
import services
from routes import auth


def test_forgot_password_stores_only_hash_and_sends_expiring_link(user):
    before = datetime.now(timezone.utc)
    auth.forgot_password(auth.ForgotPasswordRequest(email=user["email"]))
    email, link = auth.send_password_reset_email.call_args.args
    assert email == user["email"]
    assert link.startswith("https://frontend.example/reset-password?token=")
    token = parse_qs(urlparse(link).query)["token"][0]
    record = services.password_reset_tokens_table.all()[0]
    assert record["user_id"] == user["id"]
    assert record["token_hash"] == hashlib.sha256(token.encode()).hexdigest()
    assert token not in record.values()
    assert 1799 <= (datetime.fromisoformat(record["expires_at"]) - before).total_seconds() <= 1801


def test_unknown_email_does_not_reveal_account_existence(user):
    unknown = auth.forgot_password(auth.ForgotPasswordRequest(email="unknown@example.com"))
    auth.send_password_reset_email.assert_not_called()
    assert len(services.password_reset_tokens_table) == 0
    known = auth.forgot_password(auth.ForgotPasswordRequest(email=user["email"]))
    assert known == unknown


def test_new_request_invalidates_previous_links(user):
    request = auth.ForgotPasswordRequest(email=user["email"])
    auth.forgot_password(request)
    previous = services.password_reset_tokens_table.all()[0]["token_hash"]
    auth.forgot_password(request)
    assert len(services.password_reset_tokens_table) == 1
    assert services.consume_password_reset_token(previous) is None


def test_email_failure_removes_unusable_token_and_keeps_generic_message(user):
    auth.send_password_reset_email.side_effect = EmailDeliveryError("private provider details")
    result = auth.forgot_password(auth.ForgotPasswordRequest(email=user["email"]))
    assert len(services.password_reset_tokens_table) == 0
    assert result == auth.forgot_password(auth.ForgotPasswordRequest(email="unknown@example.com"))