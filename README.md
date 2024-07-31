<div align="center">

## API: LISTADO DE ANIMES

![API](https://img.shields.io/badge/API-orange?style=for-the-badge)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![Express.js](https://img.shields.io/badge/express-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

</div>

Este proyecto es la construcción de una [**API**](https://es.wikipedia.org/wiki/API) en [**NodeJs**](https://nodejs.org/en) y [**Express**](https://expressjs.com/es/) que se comunica con una base de datos [**MySQL**](https://www.mysql.com/).

La API cuenta con un sistema de registro y login para usuarios utilizando [**JSON Web Token (JWT)**](https://jwt.io/). Al autenticarse correctamente, se genera un token de acceso que habilita las funcionalidades de añadir, editar y eliminar animes.

Al tratarse de un proyecto backend (del lado del servidor), se ha desplegado en [**Render.com**](https://render.com/) y se ha empleado [**Swagger**](https://swagger.io/) para documentar la API.


### _Base de datos._
**Contiene**:
- Una tabla de animes.
- Una tabla Seiyuus (actores de voz japoneses).
- Una tabla de personajes relacionadas con **foreign keys** a las tablas de anime y seiyuus.


### _Endpoints._
#### Principales:
- `/animes` **(GET)**: Obtener el listado completo de animes.
- `/animes/:id` **(GET)**: Obtener info detallada de un anime por su ID.
- `/animes` **(POST)**: Añadir un nuevo anime.
- `/animes/:id` **(PUT)**: Editar información de un anime existente.
- `/animes/:id` **(DELETE)**: Eliminar un anime del listado.

#### Registro y Login - Autenticación de Usuarios con JWT:

- `/signup` **(POST)**: Registro de nuevos usuarios.
- `/login` **(POST)**: Inicio de sesión para obtener un token de acceso.

#### Swagger
- `/api-docs/` Acceso a la interfaz de Swagger que permite interactuar con la API y utilizar sus funcionalidades sin necesidad de configuraciones adicionales.

##

# Uso de la API 📡

###  **AUTENTICACIÓN**
-  Para **añadir (POST), modificar (PUT) o eliminar (DELETE)** animes, se requiere autenticación. 
- Se obtiene un **token en la respuesta JSON** del endpoint `/signup` o `/login`. 
- Es necesario añadir este token en los "headers" de la petición: `{"Authorization": "token"}`

### Postman
Realiza peticiones con una herramienta tipo [Postman](https://www.postman.com/) a `https://anime-seiyuus.onrender.com/` seguido del endpoint correspondiente.

### Swagger
Accede a la documentación en `https://anime-seiyuus.onrender.com/api-docs/` para utilizar la interfaz interactiva y realizar peticiones directamente desde allí.

## DIY
> **NOTA:** Necesitas tener instalado [Node JS](https://nodejs.org/)

   1. Clonar el repositorio.
   2. Instalar los módulos de NodeJS: `npm i`
   3. Crear una base de datos MySQL: `db/anime_seiyuus_db_querys.sql`
   4. Duplicar el archivo `.env_sample` y renombrar como `.env`.
   5. Rellenar `.env`:
      - Con los datos del servidor (en local y/o remoto):
         - Se puede tener uno o ambos servidores configurados pero solo se puede usar uno.
       - `JWT_SECRET_KEY`: Clave segura para cifrar/descifrar las contraseñas de los usuarios.
       - Comentar los datos que no se vayan a usar según interese.
   6. Arranca el proyecto con: `npm run dev`

   - Uso de la API:
     - **Swagger**: `http://localhost:3113/api-docs/`
     - [**Postman**](https://www.postman.com/) a la ruta `http://localhost:3113/` seguido del endpoint correspondiente.


## Comentarios

En este ejercicio he podido practicar y asentar:
- La creación y configuración de una **base de datos SQL** y el uso de claves foráneas.
- La creación y configuración de un **servidor**.
- Creación y uso de una API con **varios endpoints**.
- Manejo de registro y login con **creación de token** y **middleware** para **autenticar** un token.
- Creación de la documentación del API con **Swagger**.
- Manejar el servidor y la base de datos **subidas en la nube**.
- Creación de tests unitarios con **JEST**.


[Irene García Wodak](https://github.com/irenegwodak) 🖖

