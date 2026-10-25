-- tabla de pacientes de vetChiloe
-- se ejecuta en el SQL Editor de Neon o Supabase

-- parte de la tabla que dio el profe, mas las columnas que ya usaba
-- el frontend (raza, peso, antecedentes, dueño, alta e historial)
CREATE TABLE pacientes (
    id               SERIAL PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL,
    numero_atencion  VARCHAR(20) UNIQUE NOT NULL,
    especie          VARCHAR(50) NOT NULL,
    raza             VARCHAR(50),
    edad             INT,
    peso             NUMERIC(5,2),
    diagnostico      TEXT,
    antecedentes     TEXT,
    foto             TEXT,
    -- el dueño y el historial se guardan como json porque en el frontend
    -- ya son un objeto y una lista, asi llegan igual que antes
    dueno            JSONB,
    alta             BOOLEAN NOT NULL DEFAULT FALSE,
    historial        JSONB NOT NULL DEFAULT '[]'
);

-- paciente de prueba (seed) que pide el profe
INSERT INTO pacientes (nombre, numero_atencion, especie, edad, diagnostico, foto, historial)
VALUES ('Mercedes', '2026-B2', 'Felino', 8, 'Tratamiento por otitis leve.',
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
        '[{"fecha": "01-10-2026", "motivo": "Ingreso", "detalle": "Registrado en la clínica."}]');

-- los dos pacientes que estaban en memoria en el repositorio
INSERT INTO pacientes (nombre, numero_atencion, especie, raza, edad, peso, diagnostico, antecedentes, foto, dueno, historial)
VALUES
    ('Poi', '2026-D1', 'Gato', 'Siamés', 3, 4.2, 'Control general', '',
     '/pacientes/default.jpg',
     '{"nombre": "Camila Soto", "telefono": "912345678", "correo": "camila@correo.cl"}',
     '[{"fecha": "01-10-2026", "motivo": "Ingreso", "detalle": "Registrado en la clínica."}]'),
    ('Kou', '2026-D2', 'Perro', 'Labrador', 5, 28, 'Herida en una pata', 'Alergia a un antibiotico',
     '/pacientes/default.jpg',
     '{"nombre": "Matias Vera", "telefono": "987654321", "correo": "Sin correo"}',
     '[{"fecha": "03-10-2026", "motivo": "Ingreso", "detalle": "Registrado en la clínica."}]');

-- para revisar que quedaron guardados
SELECT * FROM pacientes;
