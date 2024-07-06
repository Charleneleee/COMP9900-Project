import enum
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import mysql.connector
import redis


class SQLType(enum.Enum):
    MYSQL = 1
    POSTGRESQL = 2


# Define a class for handling SQL connections
class SQL:
    def __init__(self, sql_config):
        self.host = sql_config["host"]
        self.user = sql_config["user"]
        self.password = sql_config["password"]
        self.database = sql_config["name"]
        self.port = sql_config["port"]

        # Determine the type of SQL database based on the config
        if sql_config["type"] == "mysql":
            self.db_type = SQLType.MYSQL
        elif sql_config["type"] == "postgresql":
            self.db_type = SQLType.POSTGRESQL
        else:
            print("Invalid sql type in config.yml!")
            exit(1)

        self.connection = None

    # Connect to the SQL database
    def connect(self):
        try:
            if self.db_type == SQLType.MYSQL:
                self.connection = mysql.connector.connect(
                    host=self.host,
                    port=self.port,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                )
                print("Connected to MySQL database")
            elif self.db_type == SQLType.POSTGRESQL:
                self.connection = psycopg2.connect(
                    host=self.host,
                    port=self.port,
                    user=self.user,
                    password=self.password,
                    dbname=self.database,
                )
                self.connection.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
                print("Connected to PostgreSQL database")
            else:
                print("Invalid database type specified")
        except (mysql.connector.Error, psycopg2.Error) as err:
            print(f"Error: {err}")

    # Disconnect from the SQL database
    def disconnect(self):
        if self.connection:
            self.connection.close()
            print("Disconnected from database")

    # Initialize the SQL database with necessary tables and data
    def initialize(self):
        if not self.connection:
            print("Error: Not connected to database")
            return

        cursor = self.connection.cursor()
        try:
            with open("sql/initialize.sql", "r", encoding="utf-8") as sql_file:
                sql_queries = sql_file.read()
                cursor.execute(sql_queries)
            if self.db_type == SQLType.MYSQL:
                print("MYSQL initialization completed")
            elif self.db_type == SQLType.POSTGRESQL:
                print("PostgreSQL initialization completed")
        except (mysql.connector.Error, psycopg2.Error) as err:
            print(f"Error: {err}")
        finally:
            cursor.close()

    # Execute a SQL query and return the results
    def query(self, query_str, params=None, fetchall_flag=True):
        if not self.connection:
            print("Error: Not connected to database")
            return None

        cursor = self.connection.cursor()
        try:
            if params:
                cursor.execute(query_str, params)
            else:
                cursor.execute(query_str)
            print("Query executed successfully")
            if fetchall_flag:
                return cursor.fetchall()
            else:
                return cursor.fetchone()
        except (mysql.connector.Error, psycopg2.Error) as err:
            print(f"Error: {err}")
            return None
        finally:
            cursor.close()

    # index the data in the database to escalate
    def data_import(self):
        files = [
            "metrics",
            "indicators",
            "frameworks",
            "companies",
            "countries",
            "favourites",
            "analysis_histories",
            "scores",
            "weights",
            "others",
            "indexes",
        ]

        if not self.connection:
            print("Error: Not connected to database")
            return

        cursor = self.connection.cursor()
        try:
            for file_path in files:
                file_path = "sql/" + file_path + ".sql"
                with open(file_path, "r", encoding="utf-8") as sql_file:
                    sql_queries = sql_file.read()
                    cursor.execute(sql_queries)

            self.connection.commit()
            print("Data import completed successfully")
        except (mysql.connector.Error, psycopg2.Error) as err:
            print(f"Error: {err}")
            self.connection.rollback()
        finally:
            cursor.close()


# Define a class for handling Redis connections
class REDIS:
    def __init__(self, redis_config):
        self.host = redis_config["host"]
        self.user = redis_config["user"]
        self.password = redis_config["password"]
        self.port = redis_config["port"]

        self.connection = None

    # Connect to the Redis database
    def connect(self):
        try:
            self.connection = redis.Redis(
                host=self.host,
                username=self.user,
                password=self.password,
                port=self.port,
                ssl=True,
            )
            print("Connected to Redis database")
        except redis.RedisError as err:
            print(f"Error: {err}")

    # Disconnect from the Redis database
    def disconnect(self):
        if self.connection:
            self.connection.close()
            print("Disconnected from Redis database")
