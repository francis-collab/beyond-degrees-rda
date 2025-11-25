"""
Test Projects CRUD
"""
def test_create_project(client, db, entrepreneur_token):
    response = client.post(
        "/api/v1/projects/",
        json={
            "title": "Eco Coffee",
            "description": "Sustainable coffee",
            "detailed_description": "Full plan",
            "sector": "Agribusiness",
            "funding_goal": 100000,
            "image_url": "https://img.com/coffee.jpg"
        },
        headers={"Authorization": f"Bearer {entrepreneur_token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Eco Coffee"
    assert data["status"] == "draft"


def test_launch_project(client, db, entrepreneur_token):
    # Create project
    create_resp = client.post(
        "/api/v1/projects/",
        json={
            "title": "Eco Coffee",
            "description": "Sustainable coffee",
            "detailed_description": "Full plan",
            "sector": "Agribusiness",
            "funding_goal": 100000,
            "image_url": "https://img.com/coffee.jpg"
        },
        headers={"Authorization": f"Bearer {entrepreneur_token}"}
    )
    assert create_resp.status_code == 201
    project_id = create_resp.json()["id"]

    # Launch project
    launch_resp = client.post(
        f"/api/v1/projects/{project_id}/launch",
        json={"launch_now": True},
        headers={"Authorization": f"Bearer {entrepreneur_token}"}
    )
    assert launch_resp.status_code == 200
    data = launch_resp.json()
    assert data["status"] == "live"