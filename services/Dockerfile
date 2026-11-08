FROM ghcr.io/astral-sh/uv:0.13.7 AS uv-bin

FROM python:3.12-slim

COPY --from=uv-bin /uv /uvx /bin/

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /workspace

COPY pyproject.toml uv.lock ./
COPY services/pyproject.toml services/pyproject.toml

RUN uv sync --frozen --no-dev --package nexova-backoffice-api --no-install-project

COPY services/ services/

RUN useradd --system --uid 10001 --create-home app \
    && mkdir -p services/data \
    && chown -R app:app /workspace

ENV PATH="/workspace/.venv/bin:$PATH"

WORKDIR /workspace/services
USER app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]