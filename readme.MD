# Hahn Software Project

# This project is a solution to the task assigned by Hahn Software. The application includes secure login and signup functionality, along with CRUD operations for products (with image support). The backend follows a hexagonal architecture comprising application, domain, and infrastructure layers.

## Prerequisites
- Docker installed on your machine
- Docker Compose installed

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hahn-software-project
   ```

2. Build and run the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Access the applications:
   - Frontend: Open your browser and go to `http://localhost:3000`
   - Backend API: The backend will be running on `http://localhost:8080`

4. To stop the application, press `CTRL + C` in the terminal where Docker Compose is running.

5. To remove the containers and volumes, run:
   ```bash
   docker-compose down -v
   ```

## Development

To run individual services for development:

```bash
# Start only the database
docker-compose up postgres

# Start backend and database
docker-compose up postgres backend

# View logs for a specific service
docker-compose logs -f backend
```

## Troubleshooting

- If you encounter build issues, try: `docker-compose down && docker-compose up --build --force-recreate`
- To clean Docker cache: `docker system prune -a`
- Check service logs: `docker-compose logs [service-name]`
- If ports are already in use, stop other services or change ports in docker-compose.yml

## Architecture

- **Backend**: Spring Boot application with PostgreSQL database
- **Frontend**: React application with Vite build tool served by Nginx
- **Database**: PostgreSQL with persistent volume storage
