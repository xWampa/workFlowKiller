'use strict';

const express = require('express');
const cors = require('cors');
const session = require('express-session');

class Server {

    constructor() {

        this.app = express();

        this.port = process.env.PORT || '8888';
        this.loginPath = '/login';
        this.todoPath = '/todo';
        this.userPath = '/user';
        this.usersPath = '/users';


        //Middlewares
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();

    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static('public'));

        // Sesiones
        const sesscfg = {
            secret: '86af5280-ba7c-11eb-9b2c-bd5f7b098ef0',
            resave: true,
            saveUninitialized: true,
            cookie: {
                sameSite: true,
                maxAge: 8 * 60 * 60 * 1000 // 8 working hours
            }
        };

        this.app.use(session(sesscfg));
    }

    routes() {

        this.app.use(this.loginPath, require('../routes/login.routes'));
        this.app.use(this.todoPath, require('../routes/todo.routes'));
        this.app.use(this.userPath, require('../routes/user.routes'));
        this.app.use(this.usersPath, require('../routes/users.routes'));
        this.app.use(this.usersPath, require('../routes/procs.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {

            console.log('Servidor corriendo en puerto', this.port);
        })
    }

}

module.exports = Server;