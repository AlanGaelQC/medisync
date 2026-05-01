CREATE DATABASE IF NOT EXISTS medisync;
USE medisync;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin','medico','recepcionista','paciente') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  especialidad VARCHAR(100) NOT NULL,
  horario VARCHAR(100),
  costo_consulta DECIMAL(10,2),
  foto_url VARCHAR(255),
  usuario_id INT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(20),
  fecha_nacimiento DATE,
  usuario_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  medico_id INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM('programada','cancelada','completada') DEFAULT 'programada',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
  FOREIGN KEY (medico_id) REFERENCES medicos(id)
);

CREATE TABLE expediente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  medico_id INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diagnostico TEXT,
  tratamiento TEXT,
  notas TEXT,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
  FOREIGN KEY (medico_id) REFERENCES medicos(id)
);

-- Datos de prueba
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Dr. Ramírez', 'director@clinica.com', '1234', 'admin'),
('Recepcionista Ana', 'ana@clinica.com', '1234', 'recepcionista'),
('Dr. López', 'lopez@clinica.com', '1234', 'medico'),
('Paciente Juan', 'juan@gmail.com', '1234', 'paciente');

INSERT INTO medicos (nombre, especialidad, horario, costo_consulta, usuario_id) VALUES
('Dr. López', 'Cardiología', 'Lun-Vie 9:00-17:00', 800.00, 3),
('Dra. García', 'Pediatría', 'Lun-Vie 8:00-14:00', 600.00, NULL),
('Dr. Torres', 'Medicina General', 'Lun-Sab 7:00-15:00', 500.00, NULL);

INSERT INTO pacientes (nombre, email, telefono, usuario_id) VALUES
('Juan Pérez', 'juan@gmail.com', '8111234567', 4),
('María González', 'maria@gmail.com', '8119876543', NULL);