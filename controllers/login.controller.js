const { response, request } = require('express');
const { db } = require('../database/config');


// Hace login del usuario cogiendo como parametros del body el user y el passwd
const loginPost = async(req = request, res = response) => {

    const { user, passwd } = req.body;

    db.get(
        'SELECT * FROM users WHERE login=?', user,
        function(err, row) {
            if (row == undefined) {
                res.json({ errormsg: 'El usuario no existe' });
            } else if (row.passwd === passwd) {
                // Crear la sesion con estos datos de usuario
                req.session.userID = row.id;
                req.session.isAdmin = (row.id == 1);

                var data = {
                    user: {
                        id: row.id,
                        login: row.login,
                        name: row.name
                    },
                    isAdmin: (row.id == 1)
                };
                res.json(data);
            } else {
                res.json({ errormsg: 'Fallo de autenticación' });
            }
        }
    );
}

module.exports = {
    loginPost
}