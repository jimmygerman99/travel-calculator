from passlib.context import CryptContext

# Define the password context for hashing and verification
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Define hashing and verification functions


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# Test the functionality
if __name__ == "__main__":
    # Test password hashing
    test_password = "my_secure_password"
    hashed_password = hash_password(test_password)
    print(f"Hashed Password: {hashed_password}")

    # Test password verification
    is_correct = verify_password(test_password, hashed_password)
    print(f"Password Verification Successful: {is_correct}")

    # Test with an incorrect password
    is_incorrect = verify_password("wrong_password", hashed_password)
    print(f"Password Verification Failed (as expected): {is_incorrect}")
