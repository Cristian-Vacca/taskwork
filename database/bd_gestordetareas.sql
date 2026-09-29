CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    creacion_fh TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS tareas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    prioridad VARCHAR(20) DEFAULT 'media',
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_limite DATE,
    hora_limite TIME,
    usuario_id INT NOT NULL,
    creacion_fh TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificacion_fh TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tarea_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);