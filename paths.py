from pathlib import Path

PROJECT_PATH: Path = Path(__file__).parent.absolute()
FRONTEND_PATH: Path = PROJECT_PATH / "frontend"
BACKEND_PATH: Path = PROJECT_PATH / "backend"
NGINX_PATH: Path = PROJECT_PATH / "nginx"

FRONTEND_DOCKERFILE_PATH: Path = FRONTEND_PATH / "Dockerfile"
BACKEND_DOCKERFILE_PATH: Path = BACKEND_PATH / "Dockerfile"
NGINX_DOCKERFILE_PATH: Path = NGINX_PATH / "Dockerfile"

PYPROJECT_PATH = PROJECT_PATH / "pyproject.toml"


REGISTRY: str = "ghcr.io/dtx-dota/website"
BACKEND_TAG: str = f"{REGISTRY}/backend"
FRONTEND_TAG: str = f"{REGISTRY}/frontend"
NGINX_TAG: str = f"{REGISTRY}/nginx"
