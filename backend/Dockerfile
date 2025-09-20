FROM python:3.12-bookworm AS builder

RUN pip install poetry==2.1.2

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

WORKDIR /app

COPY pyproject.toml poetry.lock ./
RUN touch README.md

RUN --mount=type=cache,target=$POETRY_CACHE_DIR poetry install

FROM python:3.12-slim-bookworm AS runtime

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

COPY --from=builder /app/.venv /app/.venv
WORKDIR /app
COPY ./backend /app/backend
COPY poetry.lock pyproject.toml ./
COPY ./backend /app/backend
COPY ./scripts /app/scripts
COPY __init__.py /app/
COPY paths.py /app/
COPY tasks.py /app/
RUN ls -all && ls -all .venv/bin/ && ls -all backend/
EXPOSE 8000

ENTRYPOINT ["python", "backend/manage.py", "runserver", "0.0.0.0:8000"]
