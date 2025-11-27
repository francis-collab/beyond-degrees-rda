from logging.config import fileConfig
from sqlalchemy import create_engine, pool
from alembic import context
import os

# Alembic Config object
config = context.config

# Logging config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import your Base metadata for autogenerate
from app.db.base import Base
from app import models  # ensures all models are loaded
target_metadata = Base.metadata

# ----------------------------
# Helper to get DATABASE_URL
# ----------------------------
def get_database_url():
    url = os.environ.get("DATABASE_URL")
    if url:
        # Fix Postgres URL for SQLAlchemy
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url
    else:
        # Local SQLite fallback
        if os.getenv("VERCEL"):
            sqlite_path = "/tmp/bdr.db"
        else:
            sqlite_path = "./bdr.db"
        return f"sqlite:///{sqlite_path}"

# ----------------------------
# Run migrations offline
# ----------------------------
def run_migrations_offline():
    url = get_database_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

# ----------------------------
# Run migrations online
# ----------------------------
def run_migrations_online():
    connectable = create_engine(get_database_url(), poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

# ----------------------------
# Run appropriate mode
# ----------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
