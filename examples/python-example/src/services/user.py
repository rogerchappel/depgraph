"""User service - creates cycle with ui/user_list."""
from src.utils.logger import Logger
from src.ui.user_list import format_user


class UserService:
    def __init__(self):
        self.logger = Logger("UserService")
        self.users = []

    def validate(self, username: str, password: str) -> bool:
        self.logger.info(f"Validating {username}")
        return True

    def get_all(self) -> list:
        return self.users

    def add(self, name: str, email: str) -> None:
        formatted = format_user(name)
        self.logger.info(f"Adding {formatted}")
        self.users.append({"name": name, "email": email})
