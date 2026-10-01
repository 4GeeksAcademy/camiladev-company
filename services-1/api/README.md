# API local environment

This API uses `uv` with a project-local virtual environment in `.venv/`.

## Password reset email

Password reset links are sent with Resend. Set these variables in a local
`.env` file in `services-1/api/` before starting the API:

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=onboarding@resend.dev
FRONTEND_URL=http://localhost:3000
```

Keep the Resend API key out of source control. `.env` is ignored by Git. The
onboarding sender is suitable for development; Resend may restrict it to
verified recipients until a sender/domain is configured in the Resend account.
Reset links expire after 30 minutes and can only be used once.

## First setup in a new Codespace

Install `uv` if it is not already available:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source "$HOME/.local/bin/env"
```

Then create or restore the virtual environment from the lockfile:

```bash
cd services-1/api
uv sync
```

## Activate the environment

```bash
cd services-1/api
source .venv/bin/activate
```

If activation works, the prompt should include `(api)` and this command should point inside `.venv`:

```bash
which python
```

## Run the API

```bash
cd services-1/api
uv run uvicorn main:app --reload
```

Or, after activating the environment:

```bash
uvicorn main:app --reload
```

## Why activation can fail in a new Codespace

`.venv/` is intentionally ignored by Git, so a brand-new Codespace will not include the local virtual environment. The reproducible files are `pyproject.toml`, `uv.lock`, and `.python-version`; run `uv sync` to recreate `.venv/` whenever the environment is missing.
