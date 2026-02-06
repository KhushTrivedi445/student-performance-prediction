from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import UserCreate, UserLogin
from app.core.database import db
from app.core.security import hash_password
from app.services.auth_services import login_user
from app.core.security import verify_password

from bson import ObjectId
router = APIRouter()


# =========================
# SIGNUP API
# =========================
@router.post("/signup")
async def signup(user: UserCreate):
    # check if email already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # hash password
    hashed_password = hash_password(user.password)

    user_dict = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "is_new_user":True
    }

    new_user = await db.users.insert_one(user_dict)

    return {
        "message": "User registered successfully",
        "user": {
            "id": str(new_user.inserted_id),
            "name": user.name,
            "email": user.email,
            "is_new_user": True
        }
    }


# =========================
# LOGIN API
# =========================
@router.post("/login")
async def login_user(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "is_new_user": user.get("is_new_user", False)
        }
    }

@router.post("/mark-not-new/{user_id}")
async def mark_user_not_new(user_id: str):
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_new_user": False}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User marked as old"}