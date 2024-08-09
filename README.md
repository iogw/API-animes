<div align="center">

## API: LISTADO DE ANIMES

[![API](https://img.shields.io/badge/API-orange?style=for-the-badge)](https://es.wikipedia.org/wiki/API)
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![Express.js](https://img.shields.io/badge/express-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/es/)
[![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)](https://swagger.io/)

</div>

Este proyecto es la construcción de una [**API**](https://es.wikipedia.org/wiki/API) en [**NodeJs**](https://nodejs.org/) y [**Express**](https://expressjs.com/es/) que se comunica con una base de datos [**MySQL**](https://www.mysql.com/).

La **base de datos** contiene tres tablas relacionadas entre sí: animes, personajes y dobladores.

La API consise en devolver el **listado completo** de animes registrados en formato JSON o el **detalle de un** anime según su ID. Cuenta con un sistema de **registro y login** para usuarios utilizando [**JSON Web Token (JWT)**](https://jwt.io/). Al autenticarse correctamente, se genera un token de acceso que habilita las funcionalidades de **añadir, editar y eliminar** animes.

Se utilizan consultas parametrizadas que **evitan un posible ataque** a la base de datos por inyección de código SQL.

Al tratarse de un proyecto backend, se ha desplegado en [**Render.com**](https://render.com/) y se ha empleado [**Swagger**](https://swagger.io/) para documentar la API.

<details>
<summary><strong>👇 Base de datos</strong></summary>


## Tablas:
- Animes.
- Seiyuus (actores de voz japoneses).
- Personajes relacionadas con **foreign keys** a las tablas de anime y seiyuus.
- Usuarios registrados.
##

</details>

<details>
<summary><strong>👇 Anime endpoints</strong></summary>

##
- `/animes` **(GET)**: Obtener el listado completo de animes.
- `/animes/:id` **(GET)**: Obtener info detallada de un anime por su ID.
  - Ejemplo: url/animes/2
- `/animes` **(POST)**: Añadir un nuevo anime.
  - ```json
    Ejemplo:
    {
    "title": "Kimetsu no yaiba",
    "year": "2018",
    "chapters": "105"
    }
    ```
- `/animes/:id` **(PUT)**: Editar información de un anime existente.
  - Ejemplo: url/animes/15
  - ```json
    {
    "title": "Kaze no Stigma",
    "year": "2023",
    "chapters": "10"
    }
    ```
- `/animes/:id` **(DELETE)**: Eliminar un anime del listado.
  - Ejemplo: url/animes/19

##

</details>

<details>
<summary><strong>👇 Users endpoints</strong></summary>

### Registro y Login - Autenticación de Usuarios con JWT:

- `/signup` **(POST)**: Registro de nuevos usuarios.
  - ```json
    {
    "username": "User",
    "email": "user@sample.com",
    "password": "12345678"
    }
    ```
- `/login` **(POST)**: Inicio de sesión para obtener un token de acceso.
  - ```json
    {
    "email": "user@sample.com",
    "password": "12345678"
    }
    ```
##
</details>

<details>
<summary><strong>👇 Swagger endpoint</strong></summary>

#### Swagger
- `/api-docs/` Acceso a la interfaz de Swagger que permite interactuar con la API y utilizar sus funcionalidades sin necesidad de configuraciones adicionales.
</details>

##

# Uso de la API 📡

###  **AUTENTICACIÓN**
-  Para **añadir (POST), modificar (PUT) o eliminar (DELETE)** animes, se requiere autenticación. 
- Se obtiene un **token en la respuesta JSON** del endpoint `/signup` o `/login`. 
- Es necesario añadir este token en los "headers" de la petición: `{"Authorization": "token"}`

###  **A tener en cuenta**.

Los 3 primeros animes de muestra **no se pueden editar/eliminar**. Puedes crear uno nuevo y manejarlo al gusto.

Por seguridad existe un **número máximo de entradas** posibles en la base de datos. 
  - Si intentas agregar nuevos datos y no puedes, prueba a borrar un anime existente.
  - Si intentas registrar un usuario y no puedes, ponte en contacto conmigo o prueba con las siguientes credenciales. User: `irene@sample.com` Pass: `123456578`

Si usas el proyecto en local puedes aumentar o eliminar estos límites en el código.

## Sin instalar nada, usando el despliegue en Render
<details>
<summary><strong>👇 Postman o Swagger</strong></summary>

### Postman
Realiza peticiones con una herramienta tipo [Postman](https://www.postman.com/) a `https://anime-seiyuus.onrender.com/` seguido del endpoint correspondiente.

### Swagger
Accede a la documentación en [`https://anime-seiyuus.onrender.com/api-docs/`](https://anime-seiyuus.onrender.com/api-docs/) para utilizar la interfaz interactiva y realizar peticiones directamente desde allí.

> NOTA: Si obtienes un error de CORS selecciona el esquema adecuado: "HTTPS" o "HTTP".

</details>


## DIY - Uso de forma local

<details>
<summary><strong>👇 Pasos a seguir</strong></summary>

> **NOTA:** Necesitas tener instalado [Node JS](https://nodejs.org/)

   1. Clonar el repositorio.
   2. Instalar los módulos de NodeJS: `npm i`
   3. Crear una base de datos MySQL: `db/anime_seiyuus_db_querys.sql`
   4. Duplicar el archivo `.env_sample` y renombrar como `.env`.
   5. Rellenar `.env`:
      - Con los datos del servidor (local y/o remoto):
         - Se puede tener uno o ambos servidores configurados pero solo se puede usar uno.
       - `JWT_SECRET_KEY`: Clave personal segura para cifrar/descifrar las contraseñas de los usuarios.
       - Dejar como comentario los datos que no se vayan a usar según interese para evitar conflictos.
   6. Cambia en `swagger.json` el host:
      - De: `"anime-seiyuus.onrender.com"` 
      - A: `"localhost:3113"`
   7. Arranca el proyecto con: `npm run dev`

   - Uso de la API:
     - **Swagger**: [`http://localhost:3113/api-docs/`](http://localhost:3113/api-docs/)
       - `Si obtienes un error de CORS selecciona el esquema adecuado: "HTTPS" o "HTTP".`
     - [**Postman**](https://www.postman.com/) a la ruta `http://localhost:3113/` seguido del endpoint correspondiente.

</details>

## Comentarios

En este ejercicio he podido practicar y asentar:
- La creación y configuración de una **base de datos SQL** y el uso de claves foráneas.
- La creación y configuración de un **servidor en express**.
- Creación y uso de una **API** con varios endpoints.
- Manejo de registro y login con **creación de token** y **middleware** para **autenticar** un token.
- Creación de la documentación del API con **Swagger**.
- Manejar el servidor y la base de datos **subidas en la nube**.
- Creación de tests unitarios con **JEST**.

### Actualizaciones

En un principio estaba todo el código en un solo archivo de 522 infumables líneas, así que me he puesto manos a la obra para modularizarlo. 

También he unificado las respuestas de la api, una manera más limpia y coherente de trabajar, usando **clases** de Javascript.

De paso he revisado la documentación en Swagger y he pasado el aspirador, ordenando y renombrando para que sea más útil y fácil de entender.

En este proceso me llevo:
  - Más conocimiento sobre los middleware.
  - La **librería Joi** para validación de datos.
  - Rutas y controladores.
  - **Router** de express.
  - Nodemon es muy útil pero la info de los errores no tanto.
  - No es tan rápido refactorizar como parece. 🙃
  - Tener una visión global y trabajar por módulos ayuda a poner mejores nombres a las variables.


##

¡Gracias por pasarte!

[Irene García Wodak](https://github.com/irenegwodak) 🖖

