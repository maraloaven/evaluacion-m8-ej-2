# PWA Hospital Hospital

Este es un proyecto de una aplicación web progresiva para el **Hospital Hospital**, desarrollado con **React** y **Vite**. La aplicación implementa un sistema de gestión de citas médicas y doctores, con almacenamiento offline mediante IndexedDB.

## Descripción del Proyecto

El sistema web contiene las siguientes características principales:

1. **Almacenamiento Web**:
   - Uso de LocalStorage para guardar preferencias de usuario.
   - Uso de SessionStorage para datos temporales de la sesión.
   - Implementación de IndexedDB para almacenar datos complejos de citas y doctores.

2. **Gestión de Citas Médicas**:
   - Formulario para agendar citas con validación de datos.
   - Listado de citas programadas con opciones para editar y eliminar.
   - Gestión de estado de citas (pendiente, confirmada, cancelada, completada).

3. **Gestión de Doctores**:
   - Registro y edición de información de médicos.
   - Integración con el sistema de citas.

4. **Progressive Web App (PWA)**:
   - Service Worker personalizado para funcionamiento offline.
   - Manifiesto para instalación como aplicación.
   - Cache de recursos para optimizar rendimiento.

5. **DevOps y CI/CD**:
   - Dockerización de la aplicación para entornos consistentes.
   - Pruebas automatizadas para componentes clave.
   - Pipeline de CI/CD con GitHub Actions.
   - Gestión de ramas siguiendo GitFlow simplificado.

## Tecnologías Utilizadas

- **React**: Framework principal para la interfaz de usuario.
- **Vite**: Herramienta de construcción rápida para el proyecto.
- **Bootstrap**: Para el diseño responsivo de la aplicación.
- **IndexedDB (Dexie.js)**: Para almacenamiento de datos estructurados.
- **React Router DOM**: Para la navegación entre páginas.
- **Service Worker**: Para la funcionalidad offline y PWA.
- **Docker**: Para la contenerización de la aplicación.
- **Vitest y React Testing Library**: Para pruebas automatizadas.
- **GitHub Actions**: Para la integración y despliegue continuos.

## Funcionalidades Clave

1. **Gestión de Almacenamiento**:
   - Persistencia de datos incluso sin conexión a internet.
   - Sincronización automática cuando se restaura la conexión.

2. **Interfaz Responsiva**:
   - Diseño adaptado a dispositivos móviles y de escritorio.
   - Tema claro/oscuro configurable.

3. **Experiencia Offline**:
   - Funcionamiento completo sin conexión a internet.
   - Indicador visual del estado de conexión.

4. **Instalable como Aplicación**:
   - Posibilidad de añadir a la pantalla de inicio en dispositivos móviles y de escritorio.

5. **Entorno DevOps**:
   - Contenedores Docker para ejecución consistente en cualquier entorno.
   - Pipeline automatizado para validación de código en cada cambio.
   - Flujo de trabajo organizado con ramas para desarrollo y producción.

## Estructura del Proyecto

```
evaluacion-m8-ej-2/
├── .github/
│   └── workflows/
│       └── ci.yml              # Configuración del pipeline de CI/CD
├── public/
│   ├── manifest.json           # Archivo de manifiesto PWA
│   ├── service-worker.js       # Service Worker personalizado
│   ├── robots.txt              # Archivo robots.txt básico
│   ├── icons/                  # Íconos para la PWA
│   │   ├── icon-192x192.png    # Ícono de 192x192
│   │   ├── icon-512x512.png    # Ícono de 512x512
│   │   └── favicon.ico         # Favicon
├── src/
│   ├── components/             # Componentes de React
│   │   ├── AppointmentForm.jsx # Formulario para crear citas
│   │   ├── AppointmentList.jsx # Lista de citas
│   │   ├── DoctorList.jsx      # Lista de doctores
│   │   ├── Header.jsx          # Encabezado de la aplicación
│   │   ├── Footer.jsx          # Pie de página
│   │   ├── Navbar.jsx          # Barra de navegación
│   │   ├── UserPreferences.jsx # Componente para gestionar preferencias
│   │   └── Layout.jsx          # Componente de layout principal
│   ├── pages/                  # Páginas de la aplicación
│   │   ├── Home.jsx            # Página principal
│   │   ├── Appointments.jsx    # Página de gestión de citas
│   │   ├── Doctors.jsx         # Página de listado de doctores
│   │   └── Settings.jsx        # Página de configuraciones
│   ├── services/               # Servicios para la lógica de negocio
│   │   ├── indexedDB.js        # Servicio para gestionar IndexedDB
│   │   ├── localStorage.js     # Servicio para gestionar LocalStorage
│   │   └── serviceWorkerRegistration.js # Registro del Service Worker
│   ├── test/                   # Configuración de pruebas
│   │   └── setup.js            # Configuración para pruebas con Vitest
│   ├── styles/                 # Estilos CSS
│   │   ├── index.css           # Estilos globales
│   │   └── App.css             # Estilos de la aplicación
│   ├── App.jsx                 # Componente principal de la aplicación
│   ├── App.test.jsx            # Pruebas del componente principal
│   ├── main.jsx                # Punto de entrada de la aplicación
│   └── vite-env.d.ts           # Tipos para Vite
├── Dockerfile                  # Configuración de Docker
├── docker-compose.yml          # Configuración de Docker Compose
├── vitest.config.js            # Configuración de Vitest para pruebas
├── WORKFLOW.md                 # Documentación del flujo de trabajo con Git
├── index.html                  # HTML principal
├── vite.config.js              # Configuración de Vite
├── package.json                # Dependencias y scripts
└── README.md                   # Documentación del proyecto
```

## Instrucciones de Uso

### Pasos para Ejecutar (Desarrollo)

1. Clonar el repositorio:
```bash
git clone <URL del repositorio>
cd evaluacion-m8-ej-2
```

2. Instalar dependencias:
```bash
npm install --legacy-peer-deps
```

3. Iniciar el servidor:
```bash
npm run dev
```

4. Abrir http://localhost:3000 en el navegador.

### Ejecutar con Docker

1. Construir la imagen Docker:
```bash
docker build -t hospital-app .
```

2. Ejecutar el contenedor:
```bash
docker run -p 80:80 hospital-app
```

3. Acceder a la aplicación en http://localhost:80

Alternativamente, usar Docker Compose:
```bash
docker-compose up -d
```

### Ejecutar Pruebas

```bash
npm test
```

Para ver la cobertura de código:
```bash
npm run test:coverage
```

## Flujo de Trabajo con Git

Este proyecto sigue un flujo de trabajo basado en GitFlow simplificado:

1. **Rama `master`**: Contiene código estable listo para producción.
2. **Rama `develop`**: Para integración de nuevas características.
3. **Ramas de características (`feature/*`)**: Para el desarrollo de funcionalidades específicas.

Para más detalles, consultar el archivo [WORKFLOW.md](./WORKFLOW.md).

## CI/CD con GitHub Actions

El proyecto incluye un pipeline automatizado que se ejecuta en cada push a las ramas principales:

1. **Instalación de dependencias**
2. **Compilación del proyecto**
3. **Ejecución de pruebas** (cuando están habilitadas)
4. **Construcción y verificación de la imagen Docker**

## Autor
- Martín Avendaño