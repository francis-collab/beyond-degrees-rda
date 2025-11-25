"""
BDR – Test Configuration
"""
import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import get_app
from app.database import Base, get_db
from app.utils.security import create_access_token
from app.models.user import User, UserRole

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(autouse=True, scope="session")
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db):
    app = get_app()  # Fresh app with lifespan
    app.dependency_overrides[get_db] = lambda: db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(db):
    email = f"test-{uuid.uuid4().hex[:8]}@bdr.rw"
    user = User(
        email=email,
        full_name="Test User",
        hashed_password="$2b$12$KIXs7v8Q3Z6Z6Z6Z6Z6Z6u",
        role=UserRole.entrepreneur
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture
def entrepreneur_token(test_user):
    return create_access_token({"sub": str(test_user.id), "role": "entrepreneur"})

@pytest.fixture
def backer_token(db):
    email = f"backer-{uuid.uuid4().hex[:8]}@bdr.rw"
    backer = User(
        email=email,
        full_name="Backer",
        hashed_password="$2b$12$KIXs7v8Q3Z6Z6Z6Z6Z6Z6u",
        role=UserRole.backer
    )
    db.add(backer)
    db.commit()
    db.refresh(backer)
    return create_access_token({"sub": str(backer.id), "role": "backer"})