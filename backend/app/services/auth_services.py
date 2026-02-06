from app.core.database import db
from app.core.security import verify_password

async def login_user(email: str, password: str):
    user = await db.users.find_one({"email": email})

    if not user:
        return None

    if not verify_password(password, user["password"]):
        return None

    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "is_new_user": user.get("is_new_user", True)
    }