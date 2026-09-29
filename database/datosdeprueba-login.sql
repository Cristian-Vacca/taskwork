CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO usuarios (nombre, email, contrasena_hash)
VALUES ('Usuario Prueba', 'test@gmail.com', crypt('123456', gen_salt('bf')));