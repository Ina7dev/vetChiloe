-- funciones de la base de datos de vetchiloe

-- paso 3: busca pacientes por nombre o especie en toda la base
-- ilike compara sin importar mayusculas
CREATE OR REPLACE FUNCTION buscar_pacientes(p_texto TEXT)
RETURNS SETOF pacientes AS $$
  SELECT *
  FROM pacientes
  WHERE nombre ILIKE '%' || p_texto || '%'
     OR especie ILIKE '%' || p_texto || '%'
  ORDER BY nombre;
$$ LANGUAGE sql STABLE;

-- prueba
-- SELECT * FROM buscar_pacientes('po');

-- paso 4: contador propio de postgres para el numero de atencion
CREATE SEQUENCE IF NOT EXISTS seq_atencion START 1;

-- arma el numero con el año y el contador, por ejemplo 2026-0001
CREATE OR REPLACE FUNCTION generar_numero_atencion()
RETURNS TEXT AS $$
  SELECT EXTRACT(YEAR FROM CURRENT_DATE)::TEXT
    || '-' || LPAD(nextval('seq_atencion')::TEXT, 4, '0');
$$ LANGUAGE sql VOLATILE;

-- paso 4: registra un paciente y le pone el numero automatico
-- recibe tambien raza, peso, antecedentes, dueño e historial porque la tabla los tiene
CREATE OR REPLACE FUNCTION registrar_paciente(
  p_nombre TEXT, p_especie TEXT, p_raza TEXT, p_edad INT, p_peso NUMERIC,
  p_diagnostico TEXT, p_antecedentes TEXT, p_foto TEXT,
  p_dueno JSONB, p_historial JSONB
) RETURNS pacientes AS $$
  INSERT INTO pacientes (nombre, numero_atencion, especie, raza, edad, peso,
                         diagnostico, antecedentes, foto, dueno, historial)
  VALUES (TRIM(p_nombre), generar_numero_atencion(), INITCAP(TRIM(p_especie)),
          p_raza, p_edad, p_peso, p_diagnostico, p_antecedentes, p_foto,
          p_dueno, p_historial)
  RETURNING *;
$$ LANGUAGE sql;

-- pruebas
-- SELECT generar_numero_atencion();
-- SELECT * FROM registrar_paciente(' Charkicito ', 'gato', 'Mestizo', 3, 4.5,
--   'Control sano.', '', NULL, NULL, '[]');

-- paso 5: cuenta cuantos pacientes hay de cada especie
CREATE OR REPLACE FUNCTION resumen_por_especie()
RETURNS TABLE (especie VARCHAR, total BIGINT) AS $$
  SELECT p.especie, COUNT(*)
  FROM pacientes p
  GROUP BY p.especie
  ORDER BY 2 DESC;
$$ LANGUAGE sql STABLE;

-- prueba
-- SELECT * FROM resumen_por_especie();