# 📱 RegistrApp

RegistrApp es una aplicación híbrida desarrollada con Angular e Ionic, orientada al registro y gestión de información académica, con autenticación de usuarios y navegación modular según el rol.

El proyecto está pensado como aplicación móvil y web, ideal para prácticas académicas o como base para un sistema real de registro estudiantil.

--------------------------------------------------

<details>
<summary><strong>🧠 ¿Qué es RegistrApp?</strong></summary>

RegistrApp es una aplicación que permite:

✔ Autenticación de usuarios mediante login
✔ Navegación modular por páginas
✔ Acceso a vistas específicas para alumnos
✔ Interfaz adaptable a dispositivos móviles y web
✔ Estructura escalable para nuevas funcionalidades académicas

La lógica y navegación están organizadas siguiendo buenas prácticas de Angular con soporte híbrido gracias a Ionic.

</details>

--------------------------------------------------

<details>
<summary><strong>📌 Funcionalidades principales</strong></summary>

🔐 Autenticación
- Pantalla de login
- Control de acceso a la aplicación
- Base para manejo de sesiones y roles

🎓 Módulo Alumno
- Vista principal tipo hub para alumnos
- Navegación hacia secciones académicas
- Estructura preparada para extender funcionalidades

🏠 Página Home
- Página inicial de la aplicación
- Punto de entrada tras la autenticación

📱 Aplicación híbrida
- Compatible con navegador web
- Preparada para ejecución en Android/iOS mediante Capacitor

</details>

--------------------------------------------------

<details>
<summary><strong>🛠 Tecnologías utilizadas</strong></summary>

- Angular – Framework principal de la aplicación
- Ionic Framework – Componentes UI híbridos
- TypeScript – Lenguaje principal
- HTML – Estructura de las vistas
- SCSS – Estilos de la aplicación
- Capacitor – Integración con dispositivos móviles
- Node.js / npm – Gestión de dependencias

</details>

--------------------------------------------------

<details>
<summary><strong>📂 Estructura del proyecto</strong></summary>

RegistrApp/
├── angular.json
├── package.json
├── ionic.config.json
├── capacitor.config.ts
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   ├── login.page.ts
│   │   │   ├── login.page.html
│   │   │   └── login.page.scss
│   │   ├── home/
│   │   │   ├── home.page.ts
│   │   │   ├── home.page.html
│   │   │   └── home.page.scss
│   │   ├── hub-alumno/
│   │   │   ├── hub-alumno.page.ts
│   │   │   ├── hub-alumno.page.html
│   │   │   └── hub-alumno.page.scss
│   │   ├── app-routing.module.ts
│   │   └── app.module.ts
│   ├── assets/
│   └── environments/
└── README.md

</details>

--------------------------------------------------

<details>
<summary><strong>🚀 Cómo ejecutar el proyecto localmente</strong></summary>

1. Requisitos
- Node.js (versión LTS)
- npm
- Ionic CLI

2. Clonar el repositorio

git clone https://github.com/zomni/RegistrApp.git

3. Instalar dependencias

npm install

4. Ejecutar en navegador

ionic serve

5. Ejecutar en dispositivo móvil (opcional)

ionic build
ionic cap add android
ionic cap open android

</details>

--------------------------------------------------

<details>
<summary><strong>🧪 Uso del sistema</strong></summary>

- Iniciar la aplicación
- Acceder mediante la pantalla de login
- Navegar por la página Home
- Acceder al Hub de Alumno
- Utilizar la estructura base para extender funcionalidades académicas

</details>

--------------------------------------------------
