import os
import json
from typing import List, Union
from dotenv import load_dotenv

# Load .env file if present
load_dotenv()

try:
    from pydantic_settings import BaseSettings
    from pydantic import field_validator

    class Settings(BaseSettings):
        PROJECT_NAME: str = "LabLink API"
        API_V1_STR: str = "/api/v1"
        ENVIRONMENT: str = "development"
        PORT: int = 8000

        BACKEND_CORS_ORIGINS: Union[List[str], str] = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
        ]

        @field_validator("BACKEND_CORS_ORIGINS", mode="before")
        def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
            if isinstance(v, str):
                if v.startswith("["):
                    try:
                        return json.loads(v)
                    except Exception:
                        pass
                return [i.strip() for i in v.split(",") if i.strip()]
            elif isinstance(v, (list, str)):
                return v
            raise ValueError(v)

        SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
        SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
        SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

        GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
        GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

        class Config:
            case_sensitive = True
            env_file = ".env"
            extra = "ignore"

    settings = Settings()

except ImportError:
    from pydantic import BaseModel

    class Settings(BaseModel):
        PROJECT_NAME: str = os.getenv("PROJECT_NAME", "LabLink API")
        API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
        ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
        PORT: int = int(os.getenv("PORT", "8000"))

        BACKEND_CORS_ORIGINS: List[str] = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
        ]

        SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
        SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
        SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

        GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
        GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    settings = Settings()
