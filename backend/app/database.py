from sqlalchemy import text
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
from sqlalchemy.orm import sessionmaker

# Update with your database details
DATABASE_URL = "mysql+pymysql://root:server2324%403658@localhost:3306/userinformation"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base: DeclarativeMeta = declarative_base()

# Dependency for accessing the database session in routes


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Test connection function


def test_connection():
    try:
        with engine.connect() as connection:
            print("Connection to the database was successful!")
    except Exception as e:
        print(f"Error connecting to the database: {e}")


def fetch_version():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT VERSION();"))
            for row in result:
                print(f"MySQL version: {row[0]}")
    except Exception as e:
        print(f"Error executing query: {e}")


test_connection()
fetch_version()
get_db()
