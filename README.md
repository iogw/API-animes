<div align="center">

## API dobladores de anime

<!-- Este ejercicio tiene como objetivo crear una API permita insertar, modificar, listar y eliminar información utilizando Express.js, Node.js y una bases de datos a elegir entre Mongo y MySQL.
El ejercicio incluye secciones de bonificación como la implementación de autenticación con JSON Web Tokens (JWT), uso de librerías adicionales para acceder a la base de datos con variables de entorno, despliegue en servicios en la nube, entre otros desafíos para ampliar el aprendizaje. -->

![API](https://img.shields.io/badge/API-orange?style=for-the-badge)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![Express.js](https://img.shields.io/badge/express-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

</div>

Este proyecto es la construcción de una [**API**](https://es.wikipedia.org/wiki/API) en [**NodeJs**](https://nodejs.org/en) y [**Express**](https://expressjs.com/es/) que se comunica con una base de datos [**MySQL**](https://www.mysql.com/).

La API cuenta con un sistema de registro y login para usuarios utilizando [**JSON Web Token(JWT)**](https://jwt.io/). Al autenticarse correctamente, se genera un token de acceso que habilita las funcionalidades de añadir, editar y eliminar animes.

Al tratarse de un proyecto backend (del lado del servidor), se ha subido a [**Render.com**](https://render.com/) como servidor y se ha empleado [**Swagger**](https://swagger.io/) para documentar la API.


### _Base de datos._
**Contiene**:
- Una tabla de animes.
- Una tabla Seiyuus (actores de voz japoneses).
- Una tabla de personajes relacionadas con **foreign keys** a las tablas de anime y seiyuus.


### _Endpoints._
#### Principales:
- `/animes` (GET): Obtener el listado completo de animes.
- `/animes/:id` (GET): Obtener info detallada de un anime por su ID.
- `/animes` (POST): Añadir un nuevo anime.
- `/animes/:id` (PUT): Editar información de un anime existente.
- `/animes/:id` (DELETE): Eliminar un anime del listado.

#### Registro y Login - Autenticación de Usuarios con JWT:

- `/signup` (POST): Registro de nuevos usuarios.
- `/login` (POST): Inicio de sesión para obtener un token de acceso.

#### Swagger
- `/api-docs/` Acceso a la interfaz de Swagger que permite interactuar con la API y utilizar sus funcionalidades sin necesidad de configuraciones adicionales.

##

# Uso de la API 📡
## Local
> **NOTA:** Necesitas tener instalado [Node JS](https://nodejs.org/)

   1. Clonar el repositorio.
   2. Instalar los módulos de NodeJS: `npm i`
   3. Iniciar proyecto: `npm run dev`
   2. Crear una base de datos MySQL. En el archivo `anime_seiyuus_db_querys` están las líneas para crear las tablas e introducir los datos.
   3. Rellenar el archivo `.env_sample` con los datos del servidor y la palabra de cifrado del generador de tokens. Luego, renómbralo como `.env` para que funcione en el entorno local.
   4. Arranca el proyecto con: `npm run dev`

   - Realiza peticiones utilizando una herramienta como [Postman](https://www.postman.com/) a la ruta `http://localhost:3113` seguido del endpoint correspondiente.
   -  Para acciones de añadir, modificacar o eliminar animes, se requiere autenticación mediante el token obtenido en el proceso de login. Es necesario añadir este token en los "headers" de la petición.

## Uso Remoto con Postman
2. **Uso con Postman en la Nube:**
   - Realiza peticiones con una herramienta tipo [Postman](https://www.postman.com/) a `https://anime-seiyuus.onrender.com/`
   - Para acciones de añadir, modificacar o eliminar animes, se requiere autenticación mediante el token obtenido en el proceso de login. Es necesario añadir este token en los "headers" de la petición.

## Uso con Swagger
3. **Uso con Swagger:**
   - Accede a la documentación Swagger en `https://anime-seiyuus.onrender.com/api-docs/` para utilizar la interfaz interactiva y realizar peticiones directamente desde allí.

## Tecnologías Utilizadas
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

