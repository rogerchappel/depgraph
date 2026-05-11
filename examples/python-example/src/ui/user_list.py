"""User list page - depends on services (cross-layer)."""
from src.services.user import UserService
from src.utils.logger import Logger


def format_user(name: str) -> str:
    return f"User: {name}"


class UserListPage:
    def __init__(self):
        self.user_service = UserService()
        self.logger = Logger("UserListPage")

    def render_users(self) -> str:
        users = self.user_service.get_all()
        return "<ul>" + "".join(f"<li>{u['name']}</li>" for u in users) + "</ul>"
