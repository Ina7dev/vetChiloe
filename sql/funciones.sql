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