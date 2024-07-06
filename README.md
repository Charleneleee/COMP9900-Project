# capstone-project-9900w18a_nullbody
Sure, here's the updated section with the default ports for the backend and frontend added:

### Project Startup Instructions

This guide outlines the steps to start the project, which consists of a backend built with Python 3.12.2 and a frontend using Node.js 16.19.0. There are two methods to start the project, depending on the configuration specified in the backend's `config.yml` file.

#### Method 1: Local Deployment

1. **Backend Setup:**
   - Ensure Python 3.12.2 is installed on your system.
   - Navigate to the backend directory and update `config.yml` to use the localhost configuration.
   - Install PostgreSQL 16 database and create a database according to the settings in `config.yml`.
   - Run the following commands:
     ```shell
     pip install -r requirements.txt
     python app.py
     ```
   - The backend server will be accessible at `http://localhost:5000`.

2. **Frontend Setup:**
   - Ensure Node.js 16.19.0 is installed on your system.
   - Navigate to the frontend directory and run:
     ```shell
     npm install
     npm start
     ```
   - The frontend development server will be accessible at `http://localhost:3000`.

#### Method 2: Docker Deployment

1. **Backend Setup:**
   - Ensure Docker is installed on your system.
   - Navigate to the backend directory and update `config.yml` to use the Docker configuration.
   - No need to install PostgreSQL separately; it will be managed by Docker.

2. **Frontend Setup:**
   - Ensure Node.js 16.19.0 is installed on your system.
   - Navigate to the frontend directory and run:
     ```shell
     npm install
     npm start
     ```
   - The frontend development server will be accessible at `http://localhost:3000`.

#### Common Commands:

- `npm install`: Installs frontend dependencies.
- `npm start`: Starts the frontend development server.
- `pip install -r requirements.txt`: Installs backend Python dependencies.
- `python app.py`: Starts the backend server locally on port 5000.
- `docker-compose up -d`: Starts the project using Docker containers in detached mode.

Please note that the appropriate configuration in `config.yml` should be selected based on the deployment method chosen (local or Docker).