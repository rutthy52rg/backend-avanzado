*Ruth González Estévez*


**Práctica AVANZADO Backend con mongoDB**

 - NODE VERSION 16
 - BBDD => dir mongoDB ==> run in terminal:  *./bin/mongod --dbpath ./data*
 - SHELL => dir mongoShell ==> run in terminal:   *./bin/mongosh*
 - install app => in practica_backend_avanzado => run in terminal: *npm install*
 - initial clear and chargue data in bbdd => in practica_backend_avanzado => run in terminal: *npm run initDB*
 - copy .env.example to .env and review your configuration *cp. e.nv.example .env*
 - run app => in practica_backend_avanzado => run in terminal: *npm run dev*
 - port => 3000
 - web session authenticate => user@example.com / 1234

** START APP & MICROSERVICES WITH PM2 **
 - install pm2 =>  run in terminal:  *npm install pm2@latest -g*
 - start all env_develop => *pm2 start ecosystem.config.js*
 - start all env_production => *pm2 start ecosystem.config.js --env production*
 - monitoring pannel => *pm2 monit*
 - list of process => *pm2 list*
 - logs => *pm2 logs*
 - stop all => *pm2 stop ecosystem.config.js*
 - restart all => *pm2 restart ecosystem.config.js or pm2 restart all *
 - clear all => *pm2 delete all*

 
**API INFO**
 
 - api need authenticate by token for get token:
 - GET => http://localhost:3000/apiv1/authenticate (email: user@example.com / password: 1234)

  
  *EndPoints mandatory pass token: by query-string, header or body*

 - GET => http://localhost:3000/apiv1/anuncios/
 - POST => http://localhost:3000/apiv1/anuncios/
 - PUT => http://localhost:3000/apiv1/anuncios/id
 - DELETE => http://localhost:3000/apiv1/anuncios/id

 *Queries strings example*
 *http://localhost:3000/id_anuncio?token=token_generado*

*Estructura proyecto

        |------practica_backend_avanzado
        |    |-----bin
        |       |---www.js
        |    |-----lib
        |       |---connectMongoose.js
        |       |---i18nConfigure.js (multi-idoma)
        |       |---JWTAuthMiddleware.js (autenticación api)
        |       |---sessionAuthMiddleware.js (autenticación web)
        |       |---uploadConfig.js (subida de ficheros api a uploads)
        |       |---utils.js 
        |    |-----microservicios
        |       |---thumbnailsService.js        
        |    |-----locales (traducciones- i18n)
        |       |---es.json
        |       |---en.json
        |    |-----public 
        |       |---images
        |           |---uploads (ubicación imagenes api)
        |               |---100 (ubicación thumbnails 100px microservicio)
        |    |-----models
        |       |---Announcement.js
        |       |---Users.js
        |       |---index.js
        |    |-----routes
        |       |---apiv1
        |           |---anuncios.js (api)
        |       |---about-us.js
        |       |---anuncios.js
        |       |---change-locale.js (multi-idioma)
        |       |---index.js
        |       |---loginController.js
        |    |-----views
        |       |---_footer.html
        |       |---_header.html
        |       |---about-us.html
        |       |---anuncios.html (private)
        |       |---claim.html
        |       |---error.html
        |       |---index.html
        |       |---loging.html
        |   |---.env
        |   |---anuncios.json (anuncios para initDB )
        |   |---initDB.js
        |   |---- Readme.md
