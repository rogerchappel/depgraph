"""Config module - creates cycle with auth."""
from src.core.auth import Auth


def load_config() -> dict:
    return {
        "debug": True,
        "auth_enabled": True,
    }


def init_auth() -> Auth:
    config = load_config()
    if not config["auth_enabled"]:
        raise Exception("Auth is disabled")
    return Auth()
