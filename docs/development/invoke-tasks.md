# Invoke Tasks

This project uses [Python Invoke](https://www.pyinvoke.org/) for task automation.

!!! warning "Always Source Virtual Environment"
    ```bash
    source .venv/bin/activate
    ```

## Task Namespaces

| Namespace | Description |
|-----------|-------------|
| `dev.*` | Development environment |
| `docker.*` | Docker operations |
| `db.*` | Database management |
| `test.*` | Testing commands |
| `update.*` | Dependency updates |
| `version.*` | Version management |
| `prod.*` | Production commands |

## Development Tasks (`inv dev.*`)

### Start/Stop Commands
```bash
inv dev.debug     # Start with hot reload
inv dev.live      # Start with tmux
inv dev.prod      # Run production images locally
inv dev.release   # Run release images
inv dev.test      # Start test environment
inv dev.mac       # macOS M1 specific
```

### Environment Management
```bash
inv dev.up        # Start dev environment
inv dev.down      # Stop and remove containers
inv dev.logs      # Follow container logs
inv dev.ps        # List running containers
inv dev.restart   # Restart services
inv dev.stop      # Stop without removing
inv dev.build     # Build images
inv dev.pull      # Pull images
inv dev.top       # Show running processes
inv dev.exec <service> <cmd>  # Execute command in container
```

## Docker Tasks (`inv docker.*`)

### Build
```bash
inv docker.all.build      # All images
inv docker.backend.build  # Backend only
inv docker.frontend.build # Frontend only
inv docker.nginx.build    # Nginx only
```

### Push
```bash
inv docker.all.push       # All images
inv docker.backend.push   # Backend only
inv docker.frontend.push  # Frontend only
inv docker.nginx.push     # Nginx only
```

### Pull
```bash
inv docker.all.pull       # All images
inv docker.backend.pull   # Backend only
inv docker.frontend.pull  # Frontend only
```

### Run
```bash
inv docker.backend.run    # Run backend container
inv docker.frontend.run   # Run frontend container
inv docker.nginx.run      # Run nginx container
```

## Database Tasks (`inv db.*`)

```bash
inv db.migrate              # Run all migrations
inv db.makemigrations       # Create migrations
inv db.populate.users       # Populate users
inv db.populate.tournaments # Populate tournaments
inv db.populate.all         # Reset and populate all
```

## Test Tasks (`inv test.*`)

### Cypress Testing
```bash
inv test.setup      # Full setup
inv test.open       # Cypress interactive
inv test.headless   # Cypress headless
```

### Environment Management
```bash
inv test.up        # Start test environment
inv test.down      # Stop and remove containers
inv test.logs      # Follow container logs
inv test.ps        # List running containers
inv test.restart   # Restart services
inv test.stop      # Stop without removing
inv test.build     # Build images
inv test.pull      # Pull images
inv test.top       # Show running processes
inv test.exec <service> <cmd>  # Execute command in container
```

## Update Tasks (`inv update.*`)

```bash
inv update.all       # Everything
inv update.git       # Git pull
inv update.npm       # npm install
inv update.python    # Poetry install
inv update.all_test  # Test environment
```

## Version Tasks (`inv version.*`)

```bash
inv version.set 1.2.3     # Set version
inv version.from-env      # Sync from .env.release
inv version.from-pyproject # Sync from pyproject.toml
inv version.build         # Build with version
inv version.tag           # Git tag and bump
```

## Production Tasks (`inv prod.*`)

### SSL
```bash
inv prod.certbot    # SSL certificate renewal
```

### Environment Management
```bash
inv prod.up        # Start prod environment
inv prod.down      # Stop and remove containers
inv prod.logs      # Follow container logs
inv prod.ps        # List running containers
inv prod.restart   # Restart services
inv prod.stop      # Stop without removing
inv prod.build     # Build images
inv prod.pull      # Pull images
inv prod.top       # Show running processes
inv prod.exec <service> <cmd>  # Execute command in container
```

## Task Files

- `tasks.py` - Main task definitions
- `scripts/docker.py` - Docker tasks
- `scripts/tests.py` - Test tasks
- `scripts/update.py` - Update tasks
- `scripts/version.py` - Version tasks
- `backend/tasks.py` - Database tasks
