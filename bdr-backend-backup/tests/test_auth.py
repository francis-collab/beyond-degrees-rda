"""
Test Authentication Endpoints
"""

def test_register(client, db):
    response = client.post("/api/v1/auth/register", json={
        "email": "new@bdr.rw",
        "full_name": "New User",
        "phone": "+250788123456",
        "role": "backer",
        "password": "Secure123!",
        "confirm_password": "Secure123!"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "new@bdr.rw"
    assert "id" in data

def test_login(client, test_user):
    response = client.post("/api/v1/auth/login", data={
        "username": "test@bdr.rw",
        "password": "password"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@bdr.rw"

def test_me(client, entrepreneur_token):
    response = client.get("/api/v1/auth/me", headers={
        "Authorization": f"Bearer {entrepreneur_token}"
    })
    assert response.status_code == 200
    assert response.json()["email"] == "test@bdr.rw"