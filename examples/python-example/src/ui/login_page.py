"""Login page UI component."""
from src.core.auth import Auth
from src.utils.logger import Logger


class Button:
    def __init__(self, label: str):
        self.label = label

    def render(self) -> str:
        return f"<button>{self.label}</button>"


class LoginPage:
    def __init__(self):
        self.auth = Auth()
        self.logger = Logger("LoginPage")

    def render(self) -> str:
        submit_btn = Button("Login")
        return f"<form>{submit_btn.render()}</form>"

    def handle_submit(self, username: str, password: str) -> None:
        success = self.auth.login(username, password)
        if success:
            self.logger.info("Login successful")
        else:
            self.logger.error("Login failed")
