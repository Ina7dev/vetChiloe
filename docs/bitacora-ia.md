# Bitácora de uso de IA Generativa – vetChiloé

**Integrantes:** Valentina Calderón (Claude) · Carla Vargas (Gemini)
**Fecha:** 28 de octubre de 2026

## Entrada 1 · Frontend: buscador reactivo

- **Paso:** Pasos 1 y 2, `BuscadorPaciente.jsx` e integración con `TablaPacientes` en `App.jsx`
- **Herramienta:** Claude
- **Prompt:** Le pasamos las diapositivas de los Pasos 1 y 2 y nuestro proyecto, y le pedimos adaptar el buscador a nuestros archivos.
- **Resultado:** Aceptamos el componente controlado (`type="search"`, props `texto` y `onCambiar`), el filtro por nombre o especie y el contador. Adaptamos los estilos a nuestros colores. Corregimos un filtro que la IA propuso antes de ver el enunciado, porque incluía el N° de atención.
- **Verificación:** `MER` y `mer` dan el mismo resultado, los badges mantienen su color y `xyz` muestra "No se encontraron pacientes". En Vercel no se veía porque publicaba otra rama; cambiamos la Production Branch.

## Entrada 2 · SQL: funciones en PostgreSQL

- **Paso:** Pasos 3, 4 y 5, `sql/funciones.sql`
- **Herramienta:** Claude
- **Prompt:** Le pasamos las diapositivas y nuestro `CREATE TABLE` de pacientes.
- **Resultado:** Usamos `buscar_pacientes`, `generar_numero_atencion` y `resumen_por_especie` como en el enunciado. Corregimos `registrar_paciente`: la de la diapositiva recibe 5 datos y perdía raza, peso, dueño e historial, así que la dejamos con 10, y con `p_edad INT` como en nuestra tabla.
- **Verificación:** En Neon, `resumen_por_especie()` devolvió los totales por especie y un paciente nuevo se registró con `2026-0001`. Al principio daba "function does not exist" porque no habíamos ejecutado el archivo en Neon.

## Entrada 3 · Backend: endpoints en N-Capas

- **Paso:** `GET /api/pacientes/buscar` y `GET /api/pacientes/resumen` en rutas, controlador, servicio y repositorio
- **Herramienta:** Claude
- **Prompt:** Le pasamos nuestros archivos de `server/src` y le pedimos revisar si lo estábamos haciendo bien.
- **Resultado:** Aceptamos los endpoints con nuestro estilo de `try/catch` y `Number(total)` para el BIGINT. Al revisar, la IA encontró funciones nuestras sin exportar. Descartamos una afirmación suya: dijo que los controladores no tenían `try/catch` sin haberlos visto.
- **Verificación:** `/buscar?q=po` y `/resumen` responden en Render, con los totales como números. Un "Cannot GET" en local era un archivo sin guardar.

## Entrada 4 · Frontend: etiquetas de resumen por especie

- **Paso:** Paso 5, etiquetas sobre la tabla y `src/data/claseEspecie.js`
- **Herramienta:** Claude
- **Prompt:** Le pasamos la diapositiva del Paso 5 y nuestro `App.jsx` para revisarlo.
- **Resultado:** Aceptamos mover la función de colores a `claseEspecie.js` para compartirla entre la tabla y el resumen. Nos faltaba el `div` de las etiquetas, y la IA lo detectó.
- **Verificación:** En Vercel salen las etiquetas con los colores de los badges y coinciden con Neon. Primero no aparecían porque dejamos imports duplicados en `TablaPacientes.jsx` y el build fallaba.

## Entrada 5 · Despliegue del frontend en Vercel

- **Paso:** Importar en Vercel la rama `estudiante/carla-vargas`
- **Herramienta:** Gemini
- **Prompt:** "como coloco el proyecto? por que es una rama de un repo que no es mio", y después le fuimos mostrando lo que salía en Vercel y GitHub.
- **Resultado:** Aceptamos los pasos para darle permisos a Vercel en GitHub (Add GitHub Scope y Repository access) y elegir la rama en Production Branch. Gemini dio el proyecto por "listo" apenas cargó la página, aunque todavía no se veían los datos de Supabase, así que seguimos revisando.
- **Verificación:** La página se publicó en Vercel y carga sin errores.

## Entrada 6 · SQL y backend: repositorio de pacientes en Supabase

- **Paso:** `server/src/repositories/pacientes.repository.js` y la tabla `pacientes` de Supabase
- **Herramienta:** Gemini
- **Prompt:** Le pasamos el `CREATE TABLE` de pacientes y después el esquema real de la tabla en Supabase ("estas seguro? no puedo cagarla me queda poco tiempo").
- **Resultado:** Con el primer `CREATE TABLE`, Gemini reescribió el repositorio con columnas que no existían (`propietario`). Con el esquema real se corrigió a `nombre_dueno`, `numero_atencion` y `foto`. Como en localhost el registro ya funcionaba, decidimos no aplicar más cambios a última hora.
- **Verificación:** [completar: el registro de pacientes funciona en local con Supabase]

## Entrada 7 · Backend: servidor en Render

- **Paso:** `server/app.js` y configuración del servicio en Render
- **Herramienta:** Gemini
- **Prompt:** Le pasamos `server/app.js`, la estructura de carpetas del proyecto y los logs de Render ("no hay errores en vercel, ni en render en ninguno sencillamente no carga").
- **Resultado:** Aceptamos tres correcciones reales: usar `process.env.PORT || 3001` en vez del puerto fijo, registrar la ruta `/api/hospitalizaciones` en `app.js` y agregar `DATABASE_URL` en Render, porque el log decía `injected env (0)`. Descartamos diagnósticos que no eran la causa: el Start Command (ya estaba bien), escuchar en `0.0.0.0` y que `app.js` "nunca se subió" (`git status` mostraba que sí).
- **Verificación:** [completar: si `https://vetchiloe-psbq.onrender.com/api/pacientes` responde y si los datos cargan en Vercel]

## Entrada 8 · Git: subir los cambios al repositorio propio

- **Paso:** Push de la rama `estudiante/carla-vargas`
- **Herramienta:** Gemini y Claude
- **Prompt:** Le mostramos el aviso de VS Code "No tiene permisos para insertar en Vikktor93/vetChiloe" y el resultado de `git remote -v`.
- **Resultado:** La carpeta local seguía conectada al repositorio del profesor y no al fork de Carla. Primero se puso una URL con el nombre de la rama, que daba "repository not found". Se corrigió con `git remote set-url origin` usando la URL del fork (usuario/repositorio).
- **Verificación:** El push a `estudiante/carla-vargas` funcionó y los cambios aparecen en su repositorio de GitHub.

## Reflexión en pareja

La IA nos ayudó a avanzar rápido, sobre todo cuando le dimos el proyecto completo: Claude adaptó las funciones a la tabla real y encontró errores nuestros, como funciones sin exportar.
Gemini guio a Carla paso a paso por Vercel, Render y GitHub, y detectó problemas reales, como el puerto fijo y la variable de entorno que faltaba.
Las dos se equivocaron cuando les faltaba contexto: inventaron formatos y columnas que no existían, y afirmaron causas falsas con mucha seguridad.
Gemini incluso dio el proyecto por terminado sin que cargaran los datos, por eso no podíamos confiar en el "ya está listo".
La mayoría de los problemas fueron de despliegue (ramas, variables de entorno, puertos y funciones sin ejecutar en la base), no de código.
Aprendimos que una respuesta de la IA no está lista hasta probarla en producción, y que nunca hay que compartir credenciales en un chat.