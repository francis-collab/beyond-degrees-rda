"""
Test MoMo Flow (Mocked)
"""

from unittest.mock import patch

@patch("app.utils.momo.initiate_momo_payment")
def test_initiate_payment(mock_momo, client, db, backer_token):
    mock_momo.return_value = {
        "reference_id": "123",
        "financialTransactionId": "momo-123"
    }

    response = client.post("/api/v1/transactions/", json={
        "project_id": 1,
        "amount": 20000,
        "momo_phone": "+250788123456"
    }, headers={"Authorization": f"Bearer {backer_token}"})
    assert response.status_code == 200
    assert response.json()["jobs_to_create"] == 2

def test_momo_webhook(client, db):
    payload = {
        "financialTransactionId": "momo-123",
        "externalId": "1",
        "amount": "20000",
        "status": "SUCCESSFUL"
    }
    signature = "valid-hmac"  # Mocked in momo.py

    with patch("app.utils.momo.verify_webhook_signature", return_value=True):
        response = client.post("/api/v1/transactions/webhook/momo", json=payload, headers={
            "X-Signature": signature
        })
        assert response.status_code == 200