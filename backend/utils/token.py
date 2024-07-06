import jwt
import datetime

# Function to generate token
def generate_token(SECRET_KEY, user_info):
    id, name, email, password, google_id, microsoft_id, avatar_url = user_info
    payload = {
        "id": id,
        "name": name,
        "email": email,
        "password": password,
        "google_id": google_id,
        "microsoft_id": microsoft_id,
        "avatar_url": avatar_url,
        "exp": datetime.datetime.now(datetime.UTC)
        + datetime.timedelta(minutes=360),  # Set token expiration time
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


# Function to decode token
def decode_token(SECRET_KEY, token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.exceptions.ExpiredSignatureError:
        print("Error: token expired!")
        return None
    except:
        return None
