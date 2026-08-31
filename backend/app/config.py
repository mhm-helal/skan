from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Skan"
    DATABASE_URL: str = "sqlite:///./skan.db"
    REDIS_URL: str = "redis://redis:6379/0"
    JWT_SECRET: str = "skan-super-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_HOURS: int = 720
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    EMAIL_USER: str = ""
    EMAIL_PASS: str = ""
    BASE_URL: str = "http://localhost:5173"
    FIREBASE_CREDENTIALS: str = "firebase.json"
    BROKERAGE_FEE: int = 1000
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
