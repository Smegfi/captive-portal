import requests
from config import Config

def post_user(user_id, device_mac, expiration):
    headers = {"Authorization": f"Bearer {Config.API_TOKEN}"}
    data = {
        "user-id":f"{user_id}",
        "password":"password12345",
        "email":f"{user_id}",
        "expiration":f"{expiration}",
        "comment":f"{device_mac}"
    }
    result = requests.post(f"{Config.API_URL}/api/v2/cmdb/user/group/Guest/guest", data=data, headers=headers)
    return result