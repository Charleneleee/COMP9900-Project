import json
import random
import time
from flask import Flask, jsonify, redirect, request
from flasgger import Swagger, swag_from
from flask_cors import CORS
import pandas as pd

from utils.picbed import ImgurUploader
from utils.smtp import SMTPManager
from utils.dataset import REDIS, SQL
from utils.token import generate_token, decode_token
from utils.helper import load_config

import re

app = Flask(__name__)
CORS(app)
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": "apispec_1",
            "route": "/apispec_1.json",
            "rule_filter": lambda rule: True,  # all in
            "model_filter": lambda tag: True,  # all in
        }
    ],
    "static_url_path": "/flasgger_static",
    # "static_folder": "static",  # must be set by user
    "swagger_ui": True,
    "specs_route": "/docs/",
}
template = {
    "swagger": "2.0",
    "info": {"title": "API", "description": "API for ESG platform", "version": "1.0"},
    "basePath": "",  # base bash for blueprint registration
    "schemes": ["http", "https"],
}
swagger = Swagger(app, config=swagger_config, template=template)


@app.route("/login", methods=["POST"])
@swag_from("api/login.yml")
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    google_id = data.get("google_id")
    microsoft_id = data.get("microsoft_id")
    token = data.get("token")

    if token:
        # Decode token to get user information
        user_info = decode_token(SECRET_KEY, token)
        if user_info:
            # Get user information fields
            id = user_info.get("id")
            name = user_info.get("name")
            email = user_info.get("email")
            password = user_info.get("password")
            google_id = user_info.get("google_id")
            microsoft_id = user_info.get("microsoft_id")

            # Build SQL query using decoded information
            query = "SELECT * FROM users WHERE id = %s AND name = %s AND email = %s AND password = %s AND google_id = %s AND microsoft_id = %s"
            params = (id, name, email, password, google_id, microsoft_id)
            user_info = sql.query(query, params, False)
            if user_info:
                # If matching user information is found, generate a new token and return it to the client
                token = generate_token(SECRET_KEY, user_info)
                return jsonify(
                    {
                        "message": "Token detected. Auto-Login successfully, Welcome!",
                        "token": token,
                    }
                )
            else:
                return jsonify({"error": "Token info miss matched!"})
        else:
            return jsonify({"error": "Invalid token"})
    elif google_id:
        # Login using Google ID
        query = "SELECT * FROM users WHERE google_id = %s"
        params = (google_id,)
        user_info = sql.query(query, params, False)
        if user_info:
            token = generate_token(SECRET_KEY, user_info)
            return jsonify({"message": "Login successfully, Welcome!", "token": token})
        else:
            return jsonify({"error": "Invalid Google ID or You haven't registered!"})
    elif microsoft_id:
        # Login using Microsoft ID
        query = "SELECT * FROM users WHERE microsoft_id = %s"
        params = (microsoft_id,)
        user_info = sql.query(query, params, False)
        if user_info:
            token = generate_token(SECRET_KEY, user_info)
            return jsonify({"message": "Login successfully, Welcome!", "token": token})
        else:
            return jsonify({"error": "Invalid Microsoft ID or You haven't registered!"})
    elif email and password:
        # Login using email and password
        query = "SELECT * FROM users WHERE email = %s AND password = %s"
        params = (email, password)
        user_info = sql.query(query, params, False)
        if user_info:
            token = generate_token(SECRET_KEY, user_info)
            return jsonify({"message": "Login successfully, Welcome!", "token": token})
        else:
            return jsonify(
                {"error": "Invalid email or password, or You haven't registered!"}
            )
    else:
        return jsonify({"error": "Email and password or Google ID are required"})


@app.route("/register", methods=["POST"])
@swag_from("api/register.yml")
def register():
    # Get user data from request
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    google_id = data.get("google_id")
    microsoft_id = data.get("microsoft_id")
    token = data.get("token")

    # Check if email is already used
    user = sql.query("SELECT * FROM users WHERE email = %s", (email,), False)
    if user:
        return jsonify({"error": "Email already exists"})

    # Insert user information into database
    insert_query = "INSERT INTO users (name, email, password, google_id, microsoft_id, avatar_url) VALUES (%s, %s, %s, %s, %s, %s)"
    params = (
        name,
        email,
        password,
        google_id,
        microsoft_id,
        "https://i.imgur.com/pbMbyHp.jpg",
    )  # Default avatar
    sql.query(insert_query, params, False)

    # Retrieve the inserted user information
    if email and password:
        select_query = "SELECT * FROM users WHERE email = %s AND password = %s"
        user_info = sql.query(select_query, (email, password), False)
    elif google_id:
        select_query = "SELECT * FROM users WHERE google_id = %s"
        user_info = sql.query(select_query, (google_id,), False)
    elif microsoft_id:
        select_query = "SELECT * FROM users WHERE microsoft_id = %s"
        user_info = sql.query(select_query, (microsoft_id,), False)
    else:
        return jsonify({"error": "Email and password or Google ID are required"})

    # Generate token
    token = generate_token(SECRET_KEY, user_info)

    # Return the complete user information and token
    return jsonify(
        {
            "message": "Registered successfully, Welcome!",
            "user": user_info,
            "token": token,
        }
    )


@app.route("/request_reset_password", methods=["POST"])
@swag_from("api/request_reset_password.yml")
def request_reset_password():
    # Get user data from request
    data = request.get_json()
    email = data.get("email")

    # Check if email is provided
    if not email:
        return jsonify({"error": "Email is required"})

    # Check if email format is valid
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"error": "Invalid email format"})

    # Check if user exists
    user = sql.query("SELECT * FROM users WHERE email = %s", (email,), False)

    if not user:
        return jsonify({"error": "User not found"})

    # Generate random verification code and expiration time
    code = random.randint(100000, 999999)

    redis.connection.set(email, code)
    redis.connection.expire(email, 600)  # Expire after 10 minutes

    # Send verification code to user's email
    smtp.send_email(
        email,
        "Password Reset Verification Code",
        f"Your verification code is {code}. It will expire in 10 minutes.",
    )

    return jsonify({"message": "Verification code sent successfully!"})


@app.route("/reset_password", methods=["POST"])
@swag_from("api/reset_password.yml")
def reset_password():
    # Get user data from request
    data = request.get_json()
    email = data.get("email")
    code = data.get("code")
    new_password = data.get("new_password")

    if not email or not code or not new_password:
        return jsonify({"error": "Email, code, and new password are required"})

    # Retrieve stored verification code and expiration time from Redis
    stored_code = int(redis.connection.get(email).decode())

    # Check if verification code exists
    if not stored_code:
        return jsonify({"error": "Verification code not found or expired"})

    # Check if verification code matches
    if code != stored_code:
        return jsonify({"error": "Invalid verification code"})

    # Delete verification code from Redis
    redis.connection.delete(email)

    # Update user password
    sql.query(
        "UPDATE users SET password = %s WHERE email = %s", (new_password, email), True
    )

    return jsonify({"message": "Password reset successfully"})


@app.route("/update/avatar", methods=["POST"])
@swag_from("api/update_avatar.yml")
def upload_avatar():
    # Get user data from request
    data = request.get_json()
    image_data = data.get("image")
    token = data.get("token")

    try:
        new_avatar_url = picbed.upload(image_data, "name", "avatar")
    except:
        return jsonify({"error": "Upload to Imgur picbed failed."})
    user_info = decode_token(SECRET_KEY, token)

    if user_info:
        # Get individual fields from user information
        id = user_info.get("id")
        name = user_info.get("name")
        email = user_info.get("email")
        password = user_info.get("password")
        google_id = user_info.get("google_id")
        microsoft_id = user_info.get("microsoft_id")

        # Build SQL query using decoded information
        query = "SELECT * FROM users WHERE id = %s AND name = %s AND email = %s AND password = %s AND google_id = %s AND microsoft_id = %s"
        params = (id, name, email, password, google_id, microsoft_id)
        user_info = sql.query(query, params, False)
        if user_info:
            # If matching user information is found, update the corresponding avatar URL and generate a new token to return to the client
            update_query = "UPDATE users SET avatar_url = %s WHERE id = %s AND name = %s AND email = %s AND password = %s AND google_id = %s AND microsoft_id = %s;"
            params = (
                new_avatar_url,
                id,
                name,
                email,
                password,
                google_id,
                microsoft_id,
            )
            sql.query(update_query, params, False)

            user_info = (
                id,
                name,
                email,
                password,
                google_id,
                microsoft_id,
                new_avatar_url,
            )
            token = generate_token(SECRET_KEY, user_info)
            return jsonify(
                {
                    "message": "Avatar upload successfully!",
                    "token": token,
                }
            )
        else:
            return jsonify({"error": "Token info miss matched!"})

    return jsonify({"error": "Can't get user_info from token!"})

@app.route("/update/name", methods=["POST"])
@swag_from("api/update_name.yml")
def update_name():
    """
    Update user's name in the database.
    """
    data = request.get_json()
    token = data.get("token")
    name = data.get("name")

    if not token or not name:
        return jsonify({"error": "Token and name are required"})

    user_info = decode_token(SECRET_KEY, token)

    if not user_info:
        return jsonify({"error": "Invalid token"})

    id = user_info.get("id")
    email = user_info.get("email")
    password = user_info.get("password")
    google_id = user_info.get("google_id")
    microsoft_id = user_info.get("microsoft_id")

    # Update the username information in the database
    update_query = "UPDATE users SET name = %s WHERE id = %s AND email = %s AND password = %s AND google_id = %s AND microsoft_id = %s"
    params = (name, id, email, password, google_id, microsoft_id)
    sql.query(update_query, params, True)

    user_info["name"] = name
    user_info = (
        user_info["id"],
        user_info["name"],
        user_info["email"],
        user_info["password"],
        user_info["google_id"],
        user_info["microsoft_id"],
        user_info["avatar_url"],
    )
    new_token = generate_token(SECRET_KEY, user_info)

    return jsonify({"message": "Name updated successfully", "token": new_token})


@app.route("/update/email", methods=["POST"])
@swag_from("api/update_email.yml")
def update_email():
    """
    Update user's email in the database.
    """
    data = request.get_json()
    token = data.get("token")
    email = data.get("email")

    if not token or not email:
        return jsonify({"error": "Token and email are required"})

    user_info = decode_token(SECRET_KEY, token)

    if not user_info:
        return jsonify(
            {"error": "Invalid token or token is expired, Try to login again."}
        )

    id = user_info.get("id")
    name = user_info.get("name")
    password = user_info.get("password")
    google_id = user_info.get("google_id")
    microsoft_id = user_info.get("microsoft_id")

    # Update the email information in the database
    update_query = "UPDATE users SET email = %s WHERE id = %s AND name = %s AND password = %s AND google_id = %s AND microsoft_id = %s"
    params = (email, id, name, password, google_id, microsoft_id)
    sql.query(update_query, params, True)

    user_info["email"] = email
    user_info = (
        user_info["id"],
        user_info["name"],
        user_info["email"],
        user_info["password"],
        user_info["google_id"],
        user_info["microsoft_id"],
        user_info["avatar_url"],
    )
    new_token = generate_token(SECRET_KEY, user_info)

    return jsonify({"message": "Email updated successfully", "token": new_token})


@app.route("/update/password", methods=["POST"])
@swag_from("api/update_password.yml")
def update_password():
    """
    Update user's password in the database.
    """
    data = request.get_json()
    token = data.get("token")
    password = data.get("password")

    if not token or not password:
        return jsonify({"error": "Token and password are required"})

    user_info = decode_token(SECRET_KEY, token)

    if not user_info:
        return jsonify(
            {"error": "Invalid token or token is expired, Try to login again."}
        )

    id = user_info.get("id")
    name = user_info.get("name")
    email = user_info.get("email")
    google_id = user_info.get("google_id")
    microsoft_id = user_info.get("microsoft_id")

    # Update the password information in the database
    update_query = "UPDATE users SET password = %s WHERE id = %s AND name = %s AND email = %s AND google_id = %s AND microsoft_id = %s"
    params = (password, id, name, email, google_id, microsoft_id)
    sql.query(update_query, params, True)

    user_info["password"] = password
    user_info = (
        user_info["id"],
        user_info["name"],
        user_info["email"],
        user_info["password"],
        user_info["google_id"],
        user_info["microsoft_id"],
        user_info["avatar_url"],
    )
    new_token = generate_token(SECRET_KEY, user_info)

    return jsonify({"message": "Password updated successfully", "token": new_token})


@app.route("/update/google_id", methods=["POST"])
@swag_from("api/update_google_id.yml")
def update_google_id():
    """
    Update user's Google ID in the database.
    """
    data = request.get_json()
    token = data.get("token")
    google_id = data.get("google_id")

    if not token or not google_id:
        return jsonify({"error": "Token and Google ID are required"})

    user_info = decode_token(SECRET_KEY, token)

    if not user_info:
        return jsonify(
            {"error": "Invalid token or token is expired, Try to login again."}
        )

    # Check if the google_id is already bound
    user = sql.query("SELECT * FROM users WHERE google_id = %s", (google_id,), False)
    if user:
        return jsonify({"error": "Google ID already bound."})

    id = user_info.get("id")
    name = user_info.get("name")
    email = user_info.get("email")
    password = user_info.get("password")
    microsoft_id = user_info.get("microsoft_id")

    # Update the Google ID information in the database
    update_query = "UPDATE users SET google_id = %s WHERE id = %s AND name = %s AND email = %s AND password = %s AND microsoft_id = %s"
    params = (google_id, id, name, email, password, microsoft_id)
    sql.query(update_query, params, True)

    user_info["google_id"] = google_id
    user_info = (
        user_info["id"],
        user_info["name"],
        user_info["email"],
        user_info["password"],
        user_info["google_id"],
        user_info["microsoft_id"],
        user_info["avatar_url"],
    )
    new_token = generate_token(SECRET_KEY, user_info)

    return jsonify({"message": "Google ID updated successfully", "token": new_token})


@app.route("/update/microsoft_id", methods=["POST"])
@swag_from("api/update_microsoft_id.yml")
def update_microsoft_id():
    """
    Update user's Microsoft ID in the database.
    """
    data = request.get_json()
    token = data.get("token")
    microsoft_id = data.get("microsoft_id")

    if not token or not microsoft_id:
        return jsonify({"error": "Token and Microsoft ID are required"})

    user_info = decode_token(SECRET_KEY, token)

    if not user_info:
        return jsonify(
            {"error": "Invalid token or token is expired, Try to login again."}
        )

    # Check if the microsoft_id is already bound
    user = sql.query(
        "SELECT * FROM users WHERE microsoft_id = %s", (microsoft_id,), False
    )
    if user:
        return jsonify({"error": "Microsoft ID already bound."})

    id = user_info.get("id")
    name = user_info.get("name")
    email = user_info.get("email")
    password = user_info.get("password")
    google_id = user_info.get("google_id")

    # Update the Microsoft ID information in the database
    update_query = "UPDATE users SET microsoft_id = %s WHERE id = %s AND name = %s AND email = %s AND password = %s AND google_id = %s"
    params = (microsoft_id, id, name, email, password, google_id)
    sql.query(update_query, params, True)

    user_info["microsoft_id"] = microsoft_id
    user_info = (
        user_info["id"],
        user_info["name"],
        user_info["email"],
        user_info["password"],
        user_info["google_id"],
        user_info["microsoft_id"],
        user_info["avatar_url"],
    )
    new_token = generate_token(SECRET_KEY, user_info)

    return jsonify({"message": "Microsoft ID updated successfully", "token": new_token})

@app.route("/register_check/email", methods=["POST"])
@swag_from("api/register_check_email.yml")
def check_email_exists():
    # Get the JSON data from the request
    data = request.get_json()
    email = data.get("email")

    # Query the database to check if the email already exists
    user = sql.query("SELECT * FROM users WHERE email = %s", (email,), False)

    if user:
        return jsonify({"error": "Email already exists"})
    else:
        return jsonify({"message": "Email available"})


@app.route("/company/by_country", methods=["POST"])
@swag_from("api/company_by_country.yml")
def get_companies_by_country():
    # Get the JSON data from the request
    data = request.get_json()
    country_code = data.get("country_code")

    # Check if country_code exists
    if not country_code:
        return jsonify({"error": "Country code is required"})

    # Build the SQL query
    query = "SELECT companies.name FROM companies JOIN countries ON companies.country_id = countries.id WHERE countries.code = %s"
    params = (country_code,)

    # Execute the query and get the results
    companies_data = sql.query(query, params, fetchall_flag=True)

    # Extract the company names from the query results
    companies = [company[0] for company in companies_data]

    return jsonify({"companies": companies})


@app.route("/company_info/v3", methods=["POST"])
@swag_from("api/company_info_v3.yml")
def get_company_info3():
    # Get the JSON data from the request
    data = request.get_json()
    company_name = data.get("company_name")
    framework = data.get("framework")

    # Query to get the ESG weights for the given framework
    esg_weight_query = """
    SELECT
        frameworks.E_weight,
        frameworks.S_weight,
        frameworks.G_weight
    FROM frameworks
    WHERE frameworks.name = %s
    """
    esg_weight = sql.query(esg_weight_query, (framework,), fetchall_flag=True)
    E_weight, S_weight, G_weight = esg_weight[0]

    # Query to get the company information for each pillar (E, S, G)
    info_query = """
    SELECT
        indicators.name as indicator_name,
        indicator_weights.indicator_weight as indicator_weight,
        indicators.description as indicator_description,
        metrics.name as metric_name,
        metric_weights.metric_weight as metric_weight,
        metrics.description as metric_description,
        AVG(scores.score) as score
    FROM scores
    JOIN companies ON scores.company_id = companies.id
    JOIN metrics ON scores.metric_id = metrics.id
    JOIN metric_weights on metric_weights.metric_id = metrics.id
    JOIN indicator_metrics ON indicator_metrics.metric_id = metrics.id
    JOIN indicators ON indicator_metrics.indicator_id = indicators.id
    JOIN indicator_weights ON indicator_weights.indicator_id = indicators.id
    JOIN frameworks ON indicator_weights.framework_id = frameworks.id
    WHERE companies.name = %s AND frameworks.name = %s AND metrics.pillar = %s
    GROUP BY metrics.pillar, frameworks.id, indicators.id, indicators.name, indicator_weights.framework_id, indicator_weights.indicator_weight, indicators.description, metrics.name, metric_weights.indicator_id, metric_weights.metric_weight, metrics.description
    HAVING indicators.id = metric_weights.indicator_id AND frameworks.id = indicator_weights.framework_id;
    """

    # Get the company information for pillar E
    E_info = sql.query(info_query, (company_name, framework, "E"), fetchall_flag=True)

    # Get the company information for pillar S
    S_info = sql.query(info_query, (company_name, framework, "S"), fetchall_flag=True)

    # Get the company information for pillar G
    G_info = sql.query(info_query, (company_name, framework, "G"), fetchall_flag=True)

    # Process the company information for pillar E
    E_output = {}
    
    for item in E_info:
        (
            indicator_name,
            indicator_weight,
            indicator_description,
            metric_name,
            metric_weight,
            metric_description,
            score,
        ) = item
        if (indicator_name, indicator_weight, indicator_description) not in E_output:
            E_output[(indicator_name, indicator_weight, indicator_description)] = [
                (metric_name, metric_weight, metric_description, score)
            ]
        else:
            E_output[(indicator_name, indicator_weight, indicator_description)].append(
                (metric_name, metric_weight, metric_description, score)
            )

    # Process the company information for pillar S
    S_output = {}
    for item in S_info:
        (
            indicator_name,
            indicator_weight,
            indicator_description,
            metric_name,
            metric_weight,
            metric_description,
            score,
        ) = item
        if (indicator_name, indicator_weight, indicator_description) not in S_output:
            S_output[(indicator_name, indicator_weight, indicator_description)] = [
                (metric_name, metric_weight, metric_description, score)
            ]
        else:
            S_output[(indicator_name, indicator_weight, indicator_description)].append(
                (metric_name, metric_weight, metric_description, score)
            )

    # Process the company information for pillar G
    G_output = {}
    for item in G_info:
        (
            indicator_name,
            indicator_weight,
            indicator_description,
            metric_name,
            metric_weight,
            metric_description,
            score,
        ) = item
        if (indicator_name, indicator_weight, indicator_description) not in G_output:
            G_output[(indicator_name, indicator_weight, indicator_description)] = [
                (metric_name, metric_weight, metric_description, score)
            ]
        else:
            G_output[(indicator_name, indicator_weight, indicator_description)].append(
                (metric_name, metric_weight, metric_description, score)
            )

    # Process the company information for pillar E
    E_indicators = []
    E_scores = []
    for k, v in E_output.items():
        name, weight, description = k
        metrics = [
            {
                "name": i[0],
                "weight": i[1],
                "description": i[2],
                "score": float(i[3]),
                "checked": True,
            }
            for i in v
        ]

        sum_weights = sum(i[1] for i in v)
        sum_scores = sum(float(i[1]) * float(i[3]) for i in v)
        E_scores.append((sum_scores / sum_weights) * k[1])

        E_indicators.append(
            {
                "name": name,
                "weight": weight,
                "description": description,
                "metrics": metrics,
            }
        )

    # Process the company information for pillar S
    S_indicators = []
    S_scores = []
    for k, v in S_output.items():
        name, weight, description = k
        metrics = [
            {
                "name": i[0],
                "weight": i[1],
                "description": i[2],
                "score": float(i[3]),
                "checked": True,
            }
            for i in v
        ]

        sum_weights = sum(i[1] for i in v)
        sum_scores = sum(float(i[1]) * float(i[3]) for i in v)
        S_scores.append((sum_scores / sum_weights) * k[1])

        S_indicators.append(
            {
                "name": name,
                "weight": weight,
                "description": description,
                "metrics": metrics,
            }
        )

    # Process the company information for pillar G
    G_indicators = []
    G_scores = []
    for k, v in G_output.items():
        name, weight, description = k
        metrics = [
            {
                "name": i[0],
                "weight": i[1],
                "description": i[2],
                "score": float(i[3]),
                "checked": True,
            }
            for i in v
        ]

        sum_weights = sum(i[1] for i in v)
        sum_scores = sum(float(i[1]) * float(i[3]) for i in v)
        G_scores.append((sum_scores / sum_weights) * k[1])

        G_indicators.append(
            {
                "name": name,
                "weight": weight,
                "description": description,
                "metrics": metrics,
            }
        )

    # Calculate the final score
    final_score = (
        sum(E_scores) * E_weight + sum(S_scores) * S_weight + sum(G_scores) * G_weight
    ) / (E_weight + S_weight + G_weight)

    # Return the company information
    return jsonify(
        {
            "company_name": company_name,
            "framework": framework,
            "score": final_score,
            "Risks": [
                {"name": "Environmental Risk", "weight": E_weight, "indicators": E_indicators},
                {"name": "Social Risk", "weight": S_weight, "indicators": S_indicators},
                {"name": "Governance Risk", "weight": G_weight, "indicators": G_indicators},
            ],
        }
    )
@app.route("/compare_company_info/v3", methods=["POST"])
@swag_from("api/compare_company_info_v3.yml")
def compare_company_info_v3():
    # Get JSON data from request
    data = request.get_json()
    company_1_name = data.get("company_1_name")
    company_2_name = data.get("company_2_name")
    framework = data.get("framework")

    # Query to get ESG weights for the specified framework
    esg_weight_query = """
    SELECT
        frameworks.E_weight,
        frameworks.S_weight,
        frameworks.G_weight
    FROM frameworks
    WHERE frameworks.name = %s
    """
    esg_weight = sql.query(esg_weight_query, (framework,), fetchall_flag=True)
    E_weight, S_weight, G_weight = esg_weight[0]

    # Query to get company information for each pillar (E, S, G)
    info_query = """
    SELECT *
    FROM (
        SELECT
            indicators.name as indicator_name,
            indicator_weights.indicator_weight as indicator_weight,
            indicators.description as indicator_description,
            metrics.name as metric_name,
            metric_weights.metric_weight as metric_weight,
            metrics.description as metric_description,
            AVG(CASE WHEN companies.name = %s THEN scores.score ELSE NULL END) as company_1_score,
            AVG(CASE WHEN companies.name = %s THEN scores.score ELSE NULL END) as company_2_score
        FROM scores
        JOIN companies ON scores.company_id = companies.id
        JOIN metrics ON scores.metric_id = metrics.id
        JOIN metric_weights on metric_weights.metric_id = metrics.id
        JOIN indicator_metrics ON indicator_metrics.metric_id = metrics.id
        JOIN indicators ON indicator_metrics.indicator_id = indicators.id
        JOIN indicator_weights ON indicator_weights.indicator_id = indicators.id
        JOIN frameworks ON indicator_weights.framework_id = frameworks.id
        WHERE (companies.name = %s OR companies.name = %s) AND frameworks.name = %s AND metrics.pillar = %s
        GROUP BY metrics.pillar, frameworks.id, indicators.id, indicators.name, indicator_weights.framework_id, indicator_weights.indicator_weight, indicators.description, metrics.name, metric_weights.indicator_id, metric_weights.metric_weight, metrics.description
        HAVING indicators.id = metric_weights.indicator_id AND frameworks.id = indicator_weights.framework_id
    ) AS subquery
    WHERE company_1_score != 0 AND company_2_score != 0;
    """

    # Execute queries to get information for each pillar
    E_info = sql.query(
        info_query,
        (
            company_1_name,
            company_2_name,
            company_1_name,
            company_2_name,
            framework,
            "E",
        ),
        fetchall_flag=True,
    )
    S_info = sql.query(
        info_query,
        (
            company_1_name,
            company_2_name,
            company_1_name,
            company_2_name,
            framework,
            "S",
        ),
        fetchall_flag=True,
    )
    G_info = sql.query(
        info_query,
        (
            company_1_name,
            company_2_name,
            company_1_name,
            company_2_name,
            framework,
            "G",
        ),
        fetchall_flag=True,
    )

    # Process E pillar information
    E_output = {}
    for item in E_info:
        (
            indicator_name,
            indicator_weight,
            indicator_description,
            metric_name,
            metric_weight,
            metric_description,
            score_1,
            score_2,
        ) = item
        if (indicator_name, indicator_weight, indicator_description) not in E_output:
            E_output[(indicator_name, indicator_weight, indicator_description)] = [
                (metric_name, metric_weight, metric_description, score_1, score_2)
            ]
        else:
            E_output[(indicator_name, indicator_weight, indicator_description)].append(
                (metric_name, metric_weight, metric_description, score_1, score_2)
            )

    # Process S pillar information
    S_output = {}
    for item in S_info:
        (
            indicator_name,
            indicator_weight,
            indicator_description,
            metric_name,
            metric_weight,
            metric_description,
            score_1,
            score_2,
        ) = item
        if (indicator_name, indicator_weight, indicator_description) not in S_output:
            S_output[(indicator_name, indicator_weight, indicator_description)] = [
                (metric_name, metric_weight, metric_description, score_1, score_2)
            ]
        else:
            S_output[(indicator_name, indicator_weight, indicator_description)].append(
                (metric_name, metric_weight, metric_description, score_1, score_2)
            )

    # Process G pillar information
    G_output = {}
    for item in G_info:
        (
            indicator_name,
            indicator_weight,
            indicator_description,
            metric_name,
            metric_weight,
            metric_description,
            score_1,
            score_2,
        ) = item
        if (indicator_name, indicator_weight, indicator_description) not in G_output:
            G_output[(indicator_name, indicator_weight, indicator_description)] = [
                (metric_name, metric_weight, metric_description, score_1, score_2)
            ]
        else:
            G_output[(indicator_name, indicator_weight, indicator_description)].append(
                (metric_name, metric_weight, metric_description, score_1, score_2)
            )

    # Prepare output for E pillar
    E_indicators, E_scores_1, E_scores_2 = [], [], []
    for k, v in E_output.items():
        name, weight, description = k
        metrics = [
            {
                "name": i[0],
                "weight": i[1],
                "description": i[2],
                "score_1": float(i[3]),
                "score_2": float(i[4]),
                "checked": True,
            }
            for i in v
        ]

        sum_weights = sum(i[1] for i in v)
        sum_scores_1 = sum(float(i[1]) * float(i[3]) for i in v)
        sum_scores_2 = sum(float(i[1]) * float(i[4]) for i in v)
        E_scores_1.append((sum_scores_1 / sum_weights) * k[1])
        E_scores_2.append((sum_scores_2 / sum_weights) * k[1])

        E_indicators.append(
            {
                "name": name,
                "weight": weight,
                "description": description,
                "metrics": metrics,
            }
        )

    # Prepare output for S pillar
    S_indicators, S_scores_1, S_scores_2 = [], [], []
    for k, v in S_output.items():
        name, weight, description = k
        metrics = [
            {
                "name": i[0],
                "weight": i[1],
                "description": i[2],
                "score_1": float(i[3]),
                "score_2": float(i[4]),
                "checked": True,
            }
            for i in v
        ]

        sum_weights = sum(i[1] for i in v)
        sum_scores_1 = sum(float(i[1]) * float(i[3]) for i in v)
        sum_scores_2 = sum(float(i[1]) * float(i[4]) for i in v)
        S_scores_1.append((sum_scores_1 / sum_weights) * k[1])
        S_scores_2.append((sum_scores_2 / sum_weights) * k[1])

        S_indicators.append(
            {
                "name": name,
                "weight": weight,
                "description": description,
                "metrics": metrics,
            }
        )

    # Prepare output for G pillar
    G_indicators, G_scores_1, G_scores_2 = [], [], []
    for k, v in G_output.items():
        name, weight, description = k
        metrics = [
            {
                "name": i[0],
                "weight": i[1],
                "description": i[2],
                "score_1": float(i[3]),
                "score_2": float(i[4]),
                "checked": True,
            }
            for i in v
        ]

        sum_weights = sum(i[1] for i in v)
        sum_scores_1 = sum(float(i[1]) * float(i[3]) for i in v)
        sum_scores_2 = sum(float(i[1]) * float(i[4]) for i in v)
        G_scores_1.append((sum_scores_1 / sum_weights) * k[1])
        G_scores_2.append((sum_scores_2 / sum_weights) * k[1])

        G_indicators.append(
            {
                "name": name,
                "weight": weight,
                "description": description,
                "metrics": metrics,
            }
        )

    # Prepare risk information
    Risks = [
        {"name": "Environmental Risk", "weight": E_weight, "indicators": E_indicators},
        {"name": "Social Risk", "weight": S_weight, "indicators": S_indicators},
        {"name": "Governance Risk", "weight": G_weight, "indicators": G_indicators},
    ]

    # Calculate final scores
    final_score_1 = (
        sum(E_scores_1) * E_weight
        + sum(S_scores_1) * S_weight
        + sum(G_scores_1) * G_weight
    ) / (E_weight + S_weight + G_weight)
    final_score_2 = (
        sum(E_scores_2) * E_weight
        + sum(S_scores_2) * S_weight
        + sum(G_scores_2) * G_weight
    ) / (E_weight + S_weight + G_weight)

    # Return JSON response
    return jsonify(
        {
            "company_1_name": company_1_name,
            "company_2_name": company_2_name,
            "framework": framework,
            "company_1_score": final_score_1,
            "company_2_score": final_score_2,
            "Risks": Risks,
        }
    )


@app.route("/country/all", methods=["POST"])
@swag_from("api/country_all.yml")
def get_all_countries():
    # SQL query to get all countries
    query = "SELECT name, code FROM countries"

    # Execute query and get results
    countries_data = sql.query(query, fetchall_flag=True)

    # Build JSON response
    countries = [{"name": country[0], "code": country[1]} for country in countries_data]

    return jsonify({"countries": countries})


@app.route("/list/frameworks", methods=["POST"])
@swag_from("api/list_frameworks.yml")
def get_all_frameworks():
    data = request.get_json()
    token = data.get("token")

    # Decrypt token and get user_id
    user_info = decode_token(SECRET_KEY, token)
    if not user_info:
        return jsonify({"error": "Invalid token"})
    user_id = user_info.get("id")

    # SQL query to get all frameworks
    query = """
    SELECT
        name,
        description,
        E_weight,
        S_weight,
        G_weight
    FROM frameworks
    WHERE frameworks.user_id = 0 OR frameworks.user_id = %s;
    """

    # Execute query and get results
    frameworks_data = sql.query(query, (user_id,), fetchall_flag=True)

    # Build JSON response
    frameworks = [
        {"name": framework[0], "description": framework[1], "E_weight": framework[2], "S_weight": framework[3], "G_weight": framework[4]}
        for framework in frameworks_data
    ]

    return jsonify({"frameworks": frameworks})


@app.route("/list/customized_frameworks", methods=["POST"])
@swag_from("api/list_customized_frameworks.yml")
def get_all_customized_frameworks():
    data = request.get_json()
    token = data.get("token")

    # Decrypt token and get user_id
    user_info = decode_token(SECRET_KEY, token)
    if not user_info:
        return jsonify({"error": "Invalid token"})
    user_id = user_info.get("id")

    # SQL query to get customized frameworks
    query = """
    SELECT
        name,
        description
    FROM frameworks
    WHERE frameworks.user_id = %s;
    """

    # Execute query and get results
    frameworks_data = sql.query(query, (user_id,), fetchall_flag=True)

    # Build JSON response
    frameworks = [
        {"name": framework[0], "description": framework[1]}
        for framework in frameworks_data
    ]

    return jsonify({"frameworks": frameworks})


@app.route("/list/favourite_companies", methods=["POST"])
@swag_from("api/list_favourite_companies.yml")
def get_all_favourited_companies():
    data = request.get_json()
    token = data.get("token")

    # Decrypt token and get user_id
    user_info = decode_token(SECRET_KEY, token)
    if not user_info:
        return jsonify({"error": "Invalid token"})
    user_id = user_info.get("id")

    # SQL query to get favourited companies
    query = """
    SELECT
        companies.name as company_name
    FROM favourites
    JOIN companies on favourites.company_id = companies.id
    WHERE favourites.user_id = %s;
    """

    # Execute query and get results
    favourites_data = sql.query(query, (user_id,), fetchall_flag=True)

    # Build JSON response
    favourites = [{"name": favourite[0]} for favourite in favourites_data]

    return jsonify({"favourites": favourites})


@app.route("/list/metrics", methods=["POST"])
@swag_from("api/list_metrics.yml")
def get_all_metrics():
    data = request.get_json()
    pillar = data.get("pillar")

    # SQL query to get metrics for a specific pillar
    query = """
    SELECT 
        name
    FROM metrics
    WHERE metrics.pillar = %s;
    """

    # Execute query and get results
    metrics_data = sql.query(query, (pillar,), fetchall_flag=True)
    metrics_list = [
        metric[0] for metric in metrics_data
    ]  # Extract string elements using list comprehension

    return jsonify({"metrics": metrics_list})


@app.route("/create/framework", methods=["POST"])
@swag_from("api/create_framework.yml")
def create_framework():
    data = request.get_json()
    token = data.get("token")
    framework_info = data.get("framework_info")

    # Decrypt the token and get the user_id
    user_info = decode_token(SECRET_KEY, token)
    if not user_info:
        return jsonify({"error": "Invalid token"})
    user_id = user_info.get("id")

    framework_name = framework_info.get("name")
    framework_description = framework_info.get("description")
    E_weight, S_weight, G_weight = (
        framework_info.get("E_weight"),
        framework_info.get("S_weight"),
        framework_info.get("G_weight"),
    )
    E_indicators, S_indicators, G_indicators = (
        framework_info.get("E_indicators"),
        framework_info.get("S_indicators"),
        framework_info.get("G_indicators"),
    )

    # Create framework
    query = "INSERT INTO frameworks (user_id, name, description, E_weight, S_weight, G_weight) VALUES (%s, %s, %s, %s, %s, %s)"
    params = (
        user_id,
        framework_name,
        framework_description,
        E_weight,
        S_weight,
        G_weight,
    )
    sql.query(query, params, True)

    # Get the created framework id
    query = "SELECT id FROM frameworks WHERE user_id = %s AND name = %s"
    params = (user_id, framework_name)
    framework_id = sql.query(query, params, False)

    # Create indicators
    for indicator in E_indicators:
        # Create indicator
        query = (
            "INSERT INTO indicators (user_id, name, description) VALUES (%s, %s, %s)"
        )
        params = (user_id, indicator["name"], indicator["description"])
        sql.query(query, params, True)
        # Get indicator id
        query = "SELECT id FROM indicators WHERE user_id = %s AND name = %s"
        params = (user_id, indicator["name"])
        indicator_id = sql.query(query, params, False)
        # Insert into indicator_weights
        query = "INSERT INTO indicator_weights (framework_id, indicator_id, indicator_weight) VALUES (%s, %s, %s)"
        params = (framework_id, indicator_id, indicator["weight"])
        sql.query(query, params, True)
        for metric in indicator["metrics"]:
            # Get metric id
            query = "SELECT id FROM metrics WHERE name = %s"
            params = (metric["name"],)
            metric_id = sql.query(query, params, False)
            # Insert into metric_weights
            query = "INSERT INTO metric_weights (indicator_id, metric_id, metric_weight) VALUES (%s, %s, %s)"
            params = (indicator_id, metric_id, metric["weight"])
            sql.query(query, params, True)
            # Insert into indicator_metrics
            query = "INSERT INTO indicator_metrics (indicator_id, metric_id) VALUES (%s, %s)"
            params = (indicator_id, metric_id)
            sql.query(query, params, True)
    for indicator in S_indicators:
        # Create indicator
        query = (
            "INSERT INTO indicators (user_id, name, description) VALUES (%s, %s, %s)"
        )
        params = (user_id, indicator["name"], indicator["description"])
        sql.query(query, params, True)
        # Get indicator id
        query = "SELECT id FROM indicators WHERE user_id = %s AND name = %s"
        params = (user_id, indicator["name"])
        indicator_id = sql.query(query, params, False)
        # Insert into indicator_weights
        query = "INSERT INTO indicator_weights (framework_id, indicator_id, indicator_weight) VALUES (%s, %s, %s)"
        params = (framework_id, indicator_id, indicator["weight"])
        sql.query(query, params, True)
        for metric in indicator["metrics"]:
            # Get metric id
            query = "SELECT id FROM metrics WHERE name = %s"
            params = (metric["name"],)
            metric_id = sql.query(query, params, False)
            # Insert into metric_weights
            query = "INSERT INTO metric_weights (indicator_id, metric_id, metric_weight) VALUES (%s, %s, %s)"
            params = (indicator_id, metric_id, metric["weight"])
            sql.query(query, params, True)
            # Insert into indicator_metrics
            query = "INSERT INTO indicator_metrics (indicator_id, metric_id) VALUES (%s, %s)"
            params = (indicator_id, metric_id)
            sql.query(query, params, True)
    for indicator in G_indicators:
        # Create indicator
        query = (
            "INSERT INTO indicators (user_id, name, description) VALUES (%s, %s, %s)"
        )
        params = (user_id, indicator["name"], indicator["description"])
        sql.query(query, params, True)
        # Get indicator id
        query = "SELECT id FROM indicators WHERE user_id = %s AND name = %s"
        params = (user_id, indicator["name"])
        indicator_id = sql.query(query, params, False)
        # Insert into indicator_weights
        query = "INSERT INTO indicator_weights (framework_id, indicator_id, indicator_weight) VALUES (%s, %s, %s)"
        params = (framework_id, indicator_id, indicator["weight"])
        sql.query(query, params, True)
        for metric in indicator["metrics"]:
            # Get metric id
            query = "SELECT id FROM metrics WHERE name = %s"
            params = (metric["name"],)
            metric_id = sql.query(query, params, False)
            # Insert into metric_weights
            query = "INSERT INTO metric_weights (indicator_id, metric_id, metric_weight) VALUES (%s, %s, %s)"
            params = (indicator_id, metric_id, metric["weight"])
            sql.query(query, params, True)
            # Insert into indicator_metrics
            query = "INSERT INTO indicator_metrics (indicator_id, metric_id) VALUES (%s, %s)"
            params = (indicator_id, metric_id)
            sql.query(query, params, True)

    return jsonify({"message": "Framework created!"})

@app.route("/create/favourite_company", methods=["POST"])
@swag_from("api/create_favourite_company.yml")
def create_favourite_company():
    # Get request data
    data = request.get_json()
    token = data.get("token")
    company_name = data.get("company_name")

    # Decrypt token and get user_id
    user_info = decode_token(SECRET_KEY, token)
    if not user_info:
        return jsonify({"error": "Invalid token"})
    user_id = user_info.get("id")

    # Get company_id
    query = """
    SELECT
        id
    FROM companies
    WHERE companies.name = %s;
    """
    params = (company_name,)
    company_id = sql.query(query, params, False)

    # Create favourites
    query = """
    INSERT INTO favourites (user_id, company_id) VALUES (%s, %s);
    """
    params = (user_id, company_id)
    sql.query(query, params, True)

    return jsonify({"message": "Add company to favourites success!"})


@app.route("/delete/customized_framework", methods=["POST"])
@swag_from("api/delete_customized_framework.yml")
def delete_customized_framework():
    # Get request data
    data = request.get_json()
    token = data.get("token")
    framework_name = data.get("framework_name")

    # Decrypt token and get user_id
    user_info = decode_token(SECRET_KEY, token)
    if not user_info:
        return jsonify({"error": "Invalid token"})
    user_id = user_info.get("id")

    # Get framework id
    query = """
    SELECT
        id
    from frameworks
    where frameworks.name = %s and frameworks.user_id = %s;
    """
    params = (framework_name, user_id)
    framework_id = sql.query(query, params, False)

    # Get all indicator ids
    query = """
    select
        indicators.id as indicator_id
    from frameworks
    join indicator_weights on indicator_weights.framework_id = frameworks.id
    join indicators on indicator_weights.indicator_id = indicators.id
    where frameworks.id = %s;
    """
    params = (framework_id,)
    indicator_ids = sql.query(query, params, True)

    # Delete metric_weights, indicator_weights, and indicators related to the framework
    for indicator_id in indicator_ids:
        query1 = "delete from metric_weights where indicator_id = %s;"
        query2 = "delete from indicator_weights where indicator_id = %s;"
        query3 = "delete from indicators where id = %s;"

        params = (indicator_id,)
        sql.query(query1, params, True)
        sql.query(query2, params, True)
        sql.query(query3, params, True)

    # Delete the framework
    query = "delete from frameworks where id = %s;"
    params = (framework_id,)
    sql.query(query, params, True)

    return jsonify({"message": "Framework deleted!"})


@app.route("/delete/favourite_company", methods=["POST"])
@swag_from("api/delete_favourite_company.yml")
def delete_favourite_company():
    data = request.get_json()
    token = data.get("token")
    company_name = data.get("company_name")

    # Decrypt token and get user_id
    user_info = decode_token(SECRET_KEY, token)
    if not user_info:
        return jsonify({"error": "Invalid token"})
    user_id = user_info.get("id")

    # Delete related information from favourites
    query = """
    DELETE FROM favourites
    USING companies
    WHERE favourites.company_id = companies.id
    AND companies.name = %s
    AND favourites.user_id = %s;
    """
    params = (
        company_name,
        user_id,
    )
    sql.query(query, params, True)

    return jsonify({"message": "Favourite company deleted!"})


@app.route("/save/analysis", methods=["POST"])
@swag_from("api/save_analysis.yml")
def save_analysis():
    data = request.get_json()
    token = data.get("token")
    timestamp = time.strftime(
        "%Y-%m-%d %H:%M:%S", time.localtime(data.get("timestamp") / 1000)
    )
    saved_data = json.dumps(data.get("data"))

    # Decrypt token and get user_id
    user_info = decode_token(SECRET_KEY, token)
    if not user_info:
        return jsonify({"error": "Invalid token"})
    user_id = user_info.get("id")

    # Add to analysis_histories
    query = """
    INSERT INTO analysis_histories (user_id, timestamp, data) VALUES (%s, %s, %s);
    """
    params = (user_id, timestamp, saved_data)
    sql.query(query, params, True)

    return jsonify({"message": "Analysis saved"})


@app.route("/list/analysis", methods=["POST"])
@swag_from("api/list_analysis.yml")
def list_analysis():
    """
    List analysis histories for a user.
    """
    data = request.get_json()
    token = data.get("token")

    # Decrypt token and get user_id
    user_info = decode_token(SECRET_KEY, token)
    if not user_info:
        return jsonify({"error": "Invalid token"})
    user_id = user_info.get("id")

    # Get analysis_histories
    query = """
    SELECT
        timestamp,
        data
    FROM analysis_histories
    WHERE user_id = %s;
    """
    params = (user_id,)
    analysis_histories_data = sql.query(query, params, True)

    analysis_histories = [
        {"timestamp": i[0], "data": i[1]} for i in analysis_histories_data
    ]

    return jsonify({"analysis_histories": analysis_histories})


@app.route("/delete/analysis", methods=["POST"])
@swag_from("api/delete_analysis.yml")
def delete_analysis():
    """
    Delete an analysis history for a user.
    """
    data = request.get_json()
    token = data.get("token")
    timestamp = data.get("timestamp")
    deleted_data = json.dumps(data.get("data"))

    # Decrypt token and get user_id
    user_info = decode_token(SECRET_KEY, token)
    if not user_info:
        return jsonify({"error": "Invalid token"})
    user_id = user_info.get("id")

    # Delete analysis_histories
    query = """
    DELETE FROM analysis_histories
    WHERE user_id = %s
    AND timestamp = %s
    AND data = %s;
    """
    params = (user_id, timestamp, deleted_data)
    sql.query(query, params, True)

    return jsonify({"message": "Analysis deleted"})


@app.route("/")
def index():
    """
    Redirect to Swagger UI.
    """
    return redirect(swagger_config["specs_route"])


if __name__ == "__main__":
    # Load dataset configuration
    config = load_config("config.yml")

    sql_config = config["sql"]
    redis_config = config["redis"]
    smtp_config = config["smtp"]
    picbed_config = config["imgur"]

    SECRET_KEY = config.get("secret_key")

    # Initialize database
    sql = SQL(sql_config)
    redis = REDIS(redis_config)
    smtp = SMTPManager(smtp_config)
    picbed = ImgurUploader(picbed_config)

    # Attempt to connect to the database
    sql.connect()
    redis.connect()

    # Initialize database tables
    sql.initialize()
    sql.data_import()

    # Start Flask application
    app.run(host="0.0.0.0", port=5000, debug=True)
