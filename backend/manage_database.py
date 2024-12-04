from app.database import Base, engine
from app.dbmodels import User  # Import all models here


def regenerate_tables():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables regenerated successfully!")


if __name__ == "__main__":
    regenerate_tables()
