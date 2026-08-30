from tinydb import Query
from models import User, Profile
from database import users_table, profiles_table

user_q = Query()
profile_q = Query()




#Obtener todos los usuarios
def get_all_users():
    return users_table.all()


#Obtener usuarios por id
def get_user_by_id(user_id: str):
    return users_table.get(
        user_q.id == user_id
    )

#Obtener usuarios por email
def get_user_by_email(email: str):
    return users_table.get(
        user_q.email == email
    )



#Post: crear nuevo usuario

def create_user(user: User, profile: Profile):
    if profile.user_id != user.id:
        raise ValueError("profile.user_id must match user.id")

    existing_user = get_user_by_id(user.id)
    if existing_user:
        raise ValueError("User id already exists")

    existing_email = get_user_by_email(user.email)
    if existing_email:
        raise ValueError("User email already exists")

    existing_profile = profiles_table.get(profile_q.user_id == user.id)
    if existing_profile:
        raise ValueError("Profile already exists for this user")

    users_table.insert(user.model_dump())
    profiles_table.insert(profile.model_dump())

    return user