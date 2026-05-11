"""Logger utility - no internal dependencies."""


class Logger:
    def __init__(self, prefix: str):
        self.prefix = prefix

    def info(self, message: str) -> None:
        print(f"[{self.prefix}] INFO: {message}")

    def error(self, message: str) -> None:
        print(f"[{self.prefix}] ERROR: {message}")

    def warn(self, message: str) -> None:
        print(f"[{self.prefix}] WARN: {message}")
