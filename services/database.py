import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy.engine import make_url
from sqlmodel import Session, create_engine
from tinydb import TinyDB

from errors import SafeJSONStorage


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

DATA_DIR.mkdir(exist_ok=True)

db = TinyDB(DATA_DIR / "db.json", storage=SafeJSONStorage)

suppliers_table = db.table("suppliers")
users_table = db.table("users")
profiles_table = db.table("profiles")
password_reset_tokens_table = db.table("password_reset_tokens")


load_dotenv(BASE_DIR / ".env")
database_url = os.getenv("DATABASE_URL")
if not database_url:
	raise RuntimeError("DATABASE_URL must be configured for the inventory database.")

database_url = make_url(database_url)
if database_url.drivername == "postgresql":
	database_url = database_url.set(drivername="postgresql+psycopg2")
elif database_url.drivername != "postgresql+psycopg2":
	raise RuntimeError("DATABASE_URL must use PostgreSQL with the psycopg2 driver.")

engine = create_engine(
	database_url,
	pool_pre_ping=True,
	connect_args={"connect_timeout": 10},
	hide_parameters=True,
)


def get_db():
	with Session(engine) as session:
		yield session