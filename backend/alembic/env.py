from logging.config import fileConfig
import os

from alembic import context
from dotenv import load_dotenv

from app.database.connection import Base
from app.database import models


# Load environment variables from .env
load_dotenv()


# Alembic Config object
config = context.config


# Set up Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# Read database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not configured")


# Tell Alembic which database to use
config.set_main_option("sqlalchemy.url", DATABASE_URL)


# Tell Alembic about our SQLAlchemy models
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""

    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""

    connectable = config.attributes.get("connection", None)

    if connectable is None:
        from sqlalchemy import engine_from_config

        connectable = engine_from_config(
            config.get_section(config.config_ini_section, {}),
            prefix="sqlalchemy.",
            pool_pre_ping=True,
        )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()