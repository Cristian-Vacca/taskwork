from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.models.user import User
from app.models.task import Task  # Registra el modelo para la creación de la tabla
from app.modules.auth.router import router as auth_router
from app.modules.tasks.router import router as tasks_router

# Creación automática de tablas en SQLite
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Gestor de Tareas")

# Configuración de CORS para la conexión con Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de Routers
app.include_router(auth_router, prefix="/auth", tags=["Autenticación"])
app.include_router(tasks_router, prefix="/tasks", tags=["Tareas"])