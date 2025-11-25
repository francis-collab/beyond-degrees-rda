"""
Test Page Content API
"""

def test_home_page(client, db):
    response = client.get("/api/v1/pages/home")
    assert response.status_code == 200
    data = response.json()
    assert "hero" in data
    assert data["hero"]["title"] == "Rwanda’s youth don’t wait for jobs — they create them."
    assert "featured_projects" in data

def test_about_page(client):
    response = client.get("/api/v1/pages/about")
    assert response.status_code == 200
    data = response.json()
    assert data["mission"] == "Empower Rwanda’s youth to create jobs, not wait for them."