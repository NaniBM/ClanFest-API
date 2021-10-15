# CLAN FEST API Backend

Construida con:
 - JavaScript
 - NodeJS
 - Express
 - MongoDB

Backend para el proyecto https://github.com/christopherBryan1996/PF

## Deploy en

  Heroku:  https://api-fest.herokuapp.com/

## Dependencias
- [body-parser](https://www.npmjs.com/package/body-parser)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [cors](https://www.npmjs.com/package/cors)

## Instalacion
- Clonar repo ``git clone https://github.com/NaniBM/ClanFest-API.git``
- Abrir proyecto en una terminal 
- Ejecutar ``npm install``
- En``index.js``: reemplazar  **process.env.DB_UR** por la direccion de tu base de datos en Mongo Atlas
    
    `mongoose.connect(process.env.DB_URI,{
    useNewUrlParser: true,
})`

   `mongoose.connect(**URIMongoAtlas**,{
    useNewUrlParser: true,
})`

## Trabajar en modo desarrollo
Ejecutar en la terminal **npm run dev** <br />
URL de la api en modo desarrollo: http://localhost:3008/

## Rutas (temporales de prueba)

> GET https://api-fest.herokuapp.com/users <br />
> GET https://api-fest.herokuapp.com/events



