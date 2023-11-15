Ejercicio para la evaluación final del móodulo 4 (Express JS y bases de datos SQL y noSQL) de Adalab. By Irene García Wodak.

## Ejercicio de Evaluación Final del Módulo 4 - Crear una API

Este ejercicio tiene como objetivo crear una API permita insertar, modificar, listar y eliminar información utilizando Express.js, Node.js y una bases de datos a elegir entre Mongo y MySQL.
El ejercicio incluye secciones de bonificación como la implementación de autenticación con JSON Web Tokens (JWT), uso de librerías adicionales para acceder a la base de datos con variables de entorno, despliegue en servicios en la nube, entre otros desafíos para ampliar el aprendizaje.

## Mi proyecto
Mi proyecto consiste en una API que hace peticiones a una base de datos que contiene:
- Una tabla de animes.
- Una tabla Seiyuus (actores de voz japoneses).
- Una tabla de personajes relacionadas con foreign keys a las tablas de anime y seiyuus.

La implementación actual solo permite manejar la tabla de animes, mi intención es seguir ampliando este proyecto para poder manejar las otras dos tablas.

## Funcionalidades Principales 🚀
- **Listado de animes:** Accede al listado completo de animes disponibles.
- **Acceso a un anime:** Obtén información detallada de un anime específico mediante su ID.
- **Añadir nuevo anime:** Agrega un nuevo anime al listado mediante su ID.
- **Editar anime existente:** Modifica la información de un anime ya registrado.
- **Eliminar un anime:** Elimina un anime existente del listado mediante su ID.

## Autenticación de Usuarios 🔒
La API cuenta con un sistema de registro y login para usuarios. Al autenticarse correctamente, se genera un token de acceso que habilita las funcionalidades de añadir, editar y eliminar animes.

## Endpoints Disponibles 📋
- `/animes` (GET): Obtener el listado completo de animes.
- `/animes/:id` (GET): Acceder a un anime por su ID.
- `/animes` (POST): Añadir un nuevo anime.
- `/animes/:id` (PUT): Editar información de un anime existente.
- `/animes/:id` (DELETE): Eliminar un anime del listado.

## Registro y Login de Usuarios 📝
- `/signup` (POST): Registro de nuevos usuarios.
- `/login` (POST): Inicio de sesión para obtener un token de acceso.

## Despliegue en la Nube y Documentación con Swagger ☁️

### Servicio en la Nube:
Este proyecto está actualmente desplegado en un servicio en la nube y se puede acceder a él a través de [este enlace](https://anime-seiyuus.onrender.com/). Aquí podrás interactuar con la API y utilizar sus funcionalidades sin necesidad de configuraciones adicionales.

### Documentación con Swagger:
Además, se ha implementado Swagger para la documentación completa de la API. Puedes acceder a la documentación utilizando el endpoint `/api-docs/` o a través de [este enlace](https://anime-seiyuus.onrender.com/api-docs/). La interfaz de Swagger te permitirá explorar los diferentes endpoints disponibles y realizar pruebas directamente desde tu navegador.

¡Aprovecha esta documentación interactiva y explora las funcionalidades de la API de manera sencilla y completa!


## Uso de la API 📡
Este API se puede utilizar de varias formas:

### Uso Local con Configuración
1. **Configuración Local:**
> **NOTA:** Necesitas tener instalado [Node JS](https://nodejs.org/)
   - Clona este repositorio en tu entorno local.
   - Rellena el archivo `.env_sample` con los datos del servidor deseado y la palabra de cifrado del generador de tokens. Luego, renómbralo como `.env` para que funcione en el entorno local.
   - Arranca el proyecto con:
```bash
npm run dev
```

   - Realiza peticiones utilizando una herramienta como [Postman](https://www.postman.com/) a la ruta `http://localhost:3113` seguido del endpoint correspondiente.
   -  Para acciones de añadir, modificacar o eliminar animes, se requiere autenticación mediante el token obtenido en el proceso de login. Es necesario añadir este token en los "headers" de la petición.

### Uso Remoto con Postman
2. **Uso con Postman en la Nube:**
   - Realiza peticiones con una herramienta tipo [Postman](https://www.postman.com/) a `https://anime-seiyuus.onrender.com/`
   - Para acciones de añadir, modificacar o eliminar animes, se requiere autenticación mediante el token obtenido en el proceso de login. Es necesario añadir este token en los "headers" de la petición.

### Uso con Swagger
3. **Uso con Swagger:**
   - Accede a la documentación Swagger en `https://anime-seiyuus.onrender.com/api-docs/` para utilizar la interfaz interactiva y realizar peticiones directamente desde allí.

### Tecnologías Utilizadas
- ExpressJS 
- NodeJS
- MySQL
- JSW
- JEST
- Swagger

## Nota de la autora

En este ejercicio he podido practicar y asentar:
- La creación y configuración de una base de datos SQL y el uso de claves foráneas.
- La creación y configuración de un servidor.
- Creación y uso de un API con varios endpoints.
- Manejo de registro y login con creación de token y middleware para utenticar un token.
- Creación de tests unitarios con JEST.
- Creación de la documentación del API con Swagger.
- Manejar el servidor y la base de datos subidas en la nube.


Gracias por interesarte por mi proyecto y por mi API, seguiré mejorándola para poder añadir personajes, seiyuus y visualizarlos en un front.
Cualquier duda o sugerencia mándame un DM &#129299;

Y si quieres contribuir a este proyecto, ¡no dudes en enviar un pull request!

[Irene García Wodak](https://github.com/irenegwodak)

