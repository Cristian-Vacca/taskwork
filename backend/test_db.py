import sys
import os

# Agrega la carpeta 'backend' al path para poder importar 'app'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import Base, engine, SessionLocal
from app.core.security import hash_password
from app.user import User  # Importa directamente desde backend/app/user.py

print("Creando tablas en la base de datos...")
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    email_prueba = "juan@example.com"
    user_existente = db.query(User).filter(User.email == email_prueba).first()
    
    if not user_existente:
        nuevo_usuario = User(
            email=email_prueba,
            hashed_password=hash_password("claveSegura123")
        )
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        print(f"Usuario creado con éxito. ID: {nuevo_usuario.id}, Email: {nuevo_usuario.email}")
    else:
        print(f"El usuario {email_prueba} ya existe en la base de datos.")

finally:
    db.close()