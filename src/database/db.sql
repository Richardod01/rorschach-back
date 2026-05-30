-- Enumeraciones
CREATE TYPE tipo_rol AS ENUM ('ADMIN', 'DOCTOR', 'PACIENTE');
CREATE TYPE tipo_sexo AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');
CREATE TYPE tipo_status_test AS ENUM ('PENDIENTE', 'EN_PROCESO', 'FINALIZADO', 'CANCELADO');

-- TABLA USUARIOS
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    uuid UUID NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol tipo_rol NOT NULL,
    estatus BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA DOCTORES
CREATE TABLE doctores (
    id_doctor SERIAL PRIMARY KEY,
    uuid UUID NOT NULL,
    id_usuario INT NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    cedula_profesional VARCHAR(50),
    especialidad VARCHAR(100),
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_doctor FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- TABLA PACIENTES
CREATE TABLE pacientes (
    id_paciente SERIAL PRIMARY KEY,
    uuid UUID NOT NULL,
    id_usuario INT NOT NULL UNIQUE,
    id_doctor INT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    fecha_nacimiento DATE,
    sexo tipo_sexo,
    telefono VARCHAR(20),
    ocupacion VARCHAR(100),
    direccion VARCHAR(255),
    motivo_de_consulta TEXT,
    observaciones_iniciales TEXT,
    condiciones_medicas TEXT,
    medicamentos_actuales TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_paciente FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_doctor_paciente FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor)
);

-- TABLA TESTS RORSCHACH
CREATE TABLE tests_rorschach (
    id_test SERIAL PRIMARY KEY,
    uuid UUID NOT NULL,
    id_paciente INT NOT NULL,
    id_doctor INT NOT NULL,
    fecha_inicio TIMESTAMP,
    fecha_fin TIMESTAMP,
    status tipo_status_test DEFAULT 'PENDIENTE',
    observaciones TEXT,
    resultado_ia JSONB, -- JSONB es más eficiente en Postgres
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paciente_test FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    CONSTRAINT fk_doctor_test FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor)
);

-- TABLA RESPUESTAS LAMINAS
CREATE TABLE respuestas_laminas (
    id_respuesta SERIAL PRIMARY KEY,
    uuid UUID NOT NULL,
    id_test INT NOT NULL,
    numero_lamina INT NOT NULL,
    respuesta_texto TEXT NOT NULL,
    tiempo_respuesta_segundos INT,
    emocion_predominante VARCHAR(50),
    total_capturas INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_test, numero_lamina),
    CONSTRAINT fk_test_respuesta FOREIGN KEY (id_test) REFERENCES tests_rorschach(id_test) ON DELETE CASCADE
);

-- TABLA EMOCIONES DETECTADAS
CREATE TABLE emociones_detectadas (
    id_emocion SERIAL PRIMARY KEY,
    uuid UUID NOT NULL,
    id_respuesta INT NOT NULL,
    numero_captura INT NOT NULL,
    emocion_detectada VARCHAR(50) NOT NULL,
    confianza FLOAT NOT NULL,
    timestamp_captura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_respuesta_emocion FOREIGN KEY (id_respuesta) REFERENCES respuestas_laminas(id_respuesta) ON DELETE CASCADE
);

-- 1. Crear la función
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Asignar la función a las tablas
CREATE TRIGGER update_usuarios_modtime BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_doctores_modtime BEFORE UPDATE ON doctores FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_pacientes_modtime BEFORE UPDATE ON pacientes FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_tests_modtime BEFORE UPDATE ON tests_rorschach FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_respuestas_modtime BEFORE UPDATE ON respuestas_laminas FOR EACH ROW EXECUTE PROCEDURE update_modified_column();