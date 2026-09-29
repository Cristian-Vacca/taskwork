from app.core.security import hash_password, verify_password

# Prueba de encriptación de contraseña
password_original = "mi_contraseña_secreta_123"
password_encriptada = hash_password(password_original)

print("--- PRUEBA DE SEGURIDAD ---")
print(f"Contraseña original: {password_original}")
print(f"Contraseña encriptada (Hash): {password_encriptada}")

# Verificación
es_correcta = verify_password("mi_contraseña_secreta_123", password_encriptada)
es_incorrecta = verify_password("clave_erronea", password_encriptada)

print(f"¿Coincide clave correcta?: {es_correcta}")
print(f"¿Coincide clave incorrecta?: {es_incorrecta}")