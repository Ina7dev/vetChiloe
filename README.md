# 🐧 VetPenguin

**VetPenguin** es un sistema de información veterinaria desarrollado sobre el mini proyecto vetChiloé. Es una aplicación web moderna y responsiva diseñada para gestionar y realizar el seguimiento de los datos de pacientes en clínicas veterinarias. Este proyecto sirve como base educativa para construir interfaces web escalables utilizando el ecosistema moderno de JavaScript, utilizando React.

Este proyecto se enmarca dentro de la asignatura de Tecnologías Web y Móviles de 6to Semestre en la carrera de Ingeniería Civil en Informática, de la Universidad de Los Lagos.

**Rama de trabajo:** `estudiante/valentina-calderon`

## 🌐 Sitio publicado

* **Aplicación (Vercel):** https://vetchiloe-valentina.vercel.app
* **API (Render):** https://vetchiloe-api-valentina.onrender.com/api/pacientes

> El backend está en el plan gratuito de Render, que apaga el servidor cuando no se usa. La primera carga del día puede demorar hasta un minuto mientras se vuelve a encender.

## 🎯 Propósito del Sistema

El propósito principal de este repositorio es pedagógico. Busca enseñar a los estudiantes de ingeniería la arquitectura web basada en componentes, el manejo unidireccional del estado, y la implementación de interfaces de usuario (UI) y experiencias de usuario (UX) de alto nivel, transitando progresivamente hacia un sistema Full-Stack.

## 🚀 Stack Tecnológico

**Frontend:**

* Librería Core: React + Vite
* Estilos: CSS3 nativo, con un archivo base (`index.css`) para colores, letra y tamaños
* Animaciones: react-card-flip (carnet giratorio)

**Backend:**

* Entorno de ejecución: Node.js
* Framework: Express.js (API REST)
* Base de datos: PostgreSQL en la nube (Neon), conectada con `pg` y `dotenv`

**Despliegue:**

* Frontend: Vercel (sitio estático)
* Backend: Render (Web Service)
* Base de datos: Neon (Database as a Service)

## ✨ Funcionalidades Principales (UI/UX)

* **Pestañas de navegación:** Inicio, Pacientes y Dados de alta, sin recargar la página.
* **Tabla de pacientes:** tabla responsiva con foto, N° de atención, especie con color, edad y diagnóstico.
* **Registro de pacientes:** formulario en ventana (modal) que se abre con un botón flotante. Incluye datos de la mascota, foto y datos del dueño. El paciente queda guardado en la base de datos.
* **Reingreso:** si la mascota ya tiene ficha, se busca por su N° de atención y solo se registra el motivo de la nueva visita.
* **Carnet clínico:** tarjeta giratoria con la foto y datos en el anverso, y la ficha con el dueño en el reverso. Desde ahí se puede dar de alta al paciente.
* **Detalle del paciente:** estado (en tratamiento o dado de alta), antecedentes, dueño e historial completo.
* **Eliminar paciente:** con ventana de confirmación.

> Por ahora la API tiene las rutas para listar y registrar pacientes. El reingreso, el alta y la eliminación funcionan en la página, pero todavía no se guardan en la base de datos.

## 🧱 Arquitectura en N-Capas

El sistema está separado en capas. Cada capa tiene una sola responsabilidad y solo conversa con la capa vecina.

```mermaid
flowchart TD
    subgraph Frontend - Vercel
        A[Componentes] -->|eventos| B[App.jsx]
        B -->|props| A
        B --> C[pacienteService.js]
    end

    subgraph Backend - Render
        D[routes] --> E[controllers]
        E --> F[services]
        F --> G[repositories]
    end

    C -->|fetch HTTP| D
    G -->|consultas SQL| H[(PostgreSQL - Neon)]
```

| Capa | Ubicación | Responsabilidad |
|---|---|---|
| Vista | `src/components/` | Solo muestran información, todo les llega por props |
| Servicios (frontend) | `src/services/pacienteService.js` | Pide y envía los datos a la API con `fetch` |
| Rutas | `server/src/routes/` | Define las URL (GET, POST) y a qué controlador van |
| Controladores | `server/src/controllers/` | Traducen HTTP: leen `req` y responden con `res` |
| Servicios (backend) | `server/src/services/` | Reglas de negocio: valida la especie y genera el N° de atención |
| Repositorios | `server/src/repositories/` | Los únicos que tocan la base de datos, con consultas SQL |

## 🗄️ Base de Datos

La tabla `pacientes` se crea con el script `server/database/pacientes.sql`. Parte de la tabla entregada en clases y agrega las columnas que ya usaba el frontend.

| Columna | Tipo | Detalle |
|---|---|---|
| `id` | `SERIAL` | Llave primaria, la genera la base de datos |
| `nombre` | `VARCHAR(100)` | Obligatorio |
| `numero_atencion` | `VARCHAR(20)` | Obligatorio y único |
| `especie` | `VARCHAR(50)` | Obligatorio |
| `raza` | `VARCHAR(50)` | |
| `edad` | `INT` | |
| `peso` | `NUMERIC(5,2)` | |
| `diagnostico` | `TEXT` | |
| `antecedentes` | `TEXT` | |
| `foto` | `TEXT` | Ruta o URL de la imagen |
| `dueno` | `JSONB` | Nombre, teléfono y correo del dueño |
| `alta` | `BOOLEAN` | `FALSE` por defecto |
| `historial` | `JSONB` | Lista de ingresos y altas |

El dueño y el historial se guardan como JSON porque en el frontend ya son un objeto y una lista, así llegan igual que antes.

## 🔌 Endpoints

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/pacientes` | `200` con la lista de pacientes |
| POST | `/api/pacientes` | `201` con el paciente creado |
| POST | `/api/pacientes` con especie no permitida | `400` con el mensaje de error |
| Cualquiera | Si falla la conexión con la base de datos | `500` con el mensaje de error |

## 📁 Estructura del Proyecto

```
vetChiloe/                          # Repositorio de VetPenguin
├── public/
│   ├── pacientes/                  # Fotos de los pacientes
│   │   ├── Adelia.jpg
│   │   ├── Barbijo.jpg
│   │   ├── default.jpg
│   │   └── Humboldt.jpg
│   ├── favicon.svg
│   └── icons.svg
├── server/                         # Backend (Node.js + Express)
│   ├── database/
│   │   └── pacientes.sql           # Tabla y pacientes de prueba
│   ├── src/
│   │   ├── controllers/
│   │   │   └── pacientes.controller.js
│   │   ├── repositories/
│   │   │   └── pacientes.repository.js  # Conexión a Neon y consultas SQL
│   │   ├── routes/
│   │   │   └── pacientes.routes.js
│   │   ├── services/
│   │   │   └── pacientes.service.js
│   │   └── app.js                  # Enciende el servidor
│   ├── .env                        # Cadena de conexión (no se sube a GitHub)
│   ├── .env.example                # Modelo de las variables que van en .env
│   ├── package-lock.json
│   └── package.json
├── src/                            # Frontend (React)
│   ├── assets/
│   ├── components/
│   │   ├── BarraPestanas.jsx       # Pestañas de navegación
│   │   ├── DetallePaciente.jsx     # Ventana con el detalle completo
│   │   ├── FichaClinica.jsx        # Carnet giratorio
│   │   ├── FormularioPaciente.jsx  # Registro y reingreso
│   │   ├── TablaPacientes.jsx      # Tabla del listado
│   │   └── TarjetaPaciente.jsx     # Anverso del carnet
│   │                               # (cada componente tiene su .css)
│   ├── data/
│   │   ├── pacientesMock.js        # Datos de prueba de la primera etapa
│   │   └── Razas.jsx               # Especies y razas del formulario
│   ├── services/
│   │   └── pacienteService.js      # Conexión con la API en Render
│   ├── App.css
│   ├── App.jsx                     # Componente raíz y estado global
│   ├── index.css                   # Colores, letra y tamaños base
│   └── main.jsx
├── .gitignore
├── .npmrc                          # Activa legacy-peer-deps (necesario en Vercel)
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

## ⚙️ Requisitos Previos

* [Node.js](https://nodejs.org/) (incluye npm) instalado en tu computadora local.
* Git instalado en tu entorno de desarrollo.
* Una base de datos PostgreSQL en [Neon](https://neon.com) (plan gratuito).

## 🛠️ Instalación y ejecución local

1. Clona el repositorio y entra a la rama:
   ```bash
   git clone https://github.com/Vikktor93/vetChiloe
   cd vetChiloe
   git checkout estudiante/valentina-calderon
   ```

2. Base de datos: en el SQL Editor de Neon se ejecuta `server/database/pacientes.sql`.

3. Variables de entorno: se crea `server/.env` copiando `server/.env.example` y poniendo la cadena de conexión de Neon:
   ```
   DATABASE_URL=postgresql://usuario:password@host.neon.tech/neondb?sslmode=require
   PORT=3000
   ```

4. Backend (terminal 1):
   ```bash
   cd server
   npm install
   npm run dev
   ```
   Queda funcionando en `http://localhost:3000/api/pacientes`.

5. Frontend (terminal 2, desde la carpeta raíz):
   ```bash
   npm install
   npm run dev
   ```
   Queda funcionando en `http://localhost:5173`.

> El frontend apunta a la API publicada en Render. Para probarlo con el backend local, se cambia `URL_API` en `src/services/pacienteService.js` por `http://localhost:3000/api/pacientes`.

> El archivo `.npmrc` activa `legacy-peer-deps` porque `react-card-flip` todavía pide React 18. Así también funciona la instalación en Vercel.

## ☁️ Despliegue

**Backend en Render (Web Service):**

| Configuración | Valor |
|---|---|
| Branch | `estudiante/valentina-calderon` |
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Environment Variables | `DATABASE_URL` con la cadena de conexión de Neon |

**Frontend en Vercel:**

* Se importa el proyecto desde GitHub, con la rama `estudiante/valentina-calderon`.
* Vercel detecta que es un proyecto de Vite y lo publica como sitio estático.
* En `src/services/pacienteService.js`, `URL_API` apunta a la URL pública de Render.

> El archivo `.env` nunca se sube a GitHub (está en el `.gitignore`). En Render, la cadena de conexión se configura como variable de entorno desde su panel.
   Queda funcionando en `http://localhost:3000`.

4. Frontend (terminal 2, desde la carpeta raíz):
   ```bash
   npm install
   npm run dev
   ```
   Queda funcionando en `http://localhost:5173`.

> El archivo `.npmrc` activa `legacy-peer-deps` porque `react-card-flip` todavía pide React 18. Así también funciona la instalación en Vercel.
## 🌐 Sitio publicado

* Frontend (Vercel): pendiente
* Backend (Render): pendiente
