# Cenizas

A full-stack web application with a FastAPI backend and a React (Vite) frontend, containerized with Docker and deployed using GitHub Actions.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend (FastAPI)](#backend-fastapi)
  - [Frontend (React + Vite)](#frontend-react--vite)
- [Docker Usage](#docker-usage)
- [CI/CD Deployment](#cicd-deployment)
- [Troubleshooting](#troubleshooting)

---

## Project Overview
Cenizas is a web application featuring a Python FastAPI backend and a modern React frontend (built with Vite). Both services are containerized with Docker and can be deployed automatically using GitHub Actions workflows.

---

## Tech Stack
- **Backend:** FastAPI (Python)
- **Frontend:** React (Vite)
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Deployment:** Docker Hub, self-hosted EC2 runner

---

## Directory Structure
```
Cenizas/
  backend/           # FastAPI backend
    Dockerfile
    main.py
    requirements.txt
    ...
  client/            # React frontend (Vite)
    Dockerfile
    src/
    package.json
    ...
```

---

## Setup Instructions

### Backend (FastAPI)

#### 1. Local Development
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```
- The API will be available at `http://localhost:8000`

#### 2. Docker
```bash
cd backend
docker build -t jai092/cenizas-fastapi:latest .
docker run -d -p 8000:8000 --name cenizas-fastapi-container jai092/cenizas-fastapi:latest
```

---

### Frontend (React + Vite)

#### 1. Local Development
```bash
cd client
npm install
npm run dev
```
- The app will be available at `http://localhost:3000`

#### 2. Docker
```bash
cd client
docker build -t jai092/cenizas-react:latest .
docker run -d -p 80:80 --name cenizas-react-container jai092/cenizas-react:latest
```
- The app will be available at `http://localhost/`

---

## Docker Usage
- Both backend and frontend have their own Dockerfiles.
- Images are tagged and pushed to Docker Hub via GitHub Actions.
- Containers expose ports 8000 (backend) and 80 (frontend).

---

## CI/CD Deployment

### GitHub Actions Workflows
- **Backend:** `.github/workflows/cicd.yaml` in `backend/`
- **Frontend:** `.github/workflows/cicd.yaml` in `client/`

#### Workflow Steps
1. On push to `main`, GitHub Actions builds and pushes Docker images to Docker Hub.
2. A self-hosted runner (e.g., EC2) pulls the latest image and restarts the container.

#### Requirements
- Docker Hub credentials (`DOCKER_USERNAME`, `DOCKER_PASSWORD`) set as GitHub repo secrets.
- Self-hosted runner (EC2) registered and online.
- EC2 security group allows inbound traffic on ports 80 and 8000.

---

## Troubleshooting
- **Image not found on EC2:** Ensure the deploy job runs on your EC2 self-hosted runner and Docker Hub credentials are correct.
- **Port issues:** Make sure the correct ports are exposed and mapped in Docker and allowed in your EC2 security group.
- **Build errors:** Check Dockerfile paths and Vite/FastAPI build output directories.

---

## License
MIT (or your preferred license)
