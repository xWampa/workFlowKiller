const { response, request } = require('express');
const { db } = require('../database/config');

// Listar todos los usuarios
var usersGet = async(req = request, res = response) => {
    db.all(
        'SELECT id, login, name, email FROM users',
        function(err, rows) {
            if (err) {
                //console.log("error raro");
                res.status(500).send("error: " + err);
            } else {
                //console.log("todo ok");
                res.json(rows);
            }
        }
    );
};

module.exports = {
    usersGet
}