"""Main entry point."""
from src.core.auth import Auth
from src.ui.login_page import LoginPage
from src.utils.logger import Logger


def main():
    logger = Logger("App")
    auth = Auth()
    login_page = LoginPage()
    logger.info("App initialized")
    print(login_page.render())


if __name__ == "__main__":
    main()
