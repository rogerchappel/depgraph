"""Core authentication module."""
from src.utils.logger import Logger
from src.services.user import UserService


class Auth:
    def __init__(self):
        self.logger = Logger("Auth")
        self.user_service = UserService()

    def login(self, username: str, password: str) -> bool:
        self.logger.info(f"Login attempt for {username}")
        return self.user_service.validate(username, password)
