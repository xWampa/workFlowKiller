const { response, request } = require('express');
const { db } = require('../database/config');

// Obtener los datos de un usuario
const userGet = async(req = request, res = response) => {
    db.get(
        'SELECT * FROM users WHERE id=?', req.params.id,
        function(err, row) {
            if (row == undefined)
                res.status(500).send(err);
            else
                res.json({
                    id: row.id,
                    name: row.name,
                    email: row.email
                });
        }
    );
};

// Crear un nuevo usuario
const userPost = async(req = request, res = response) => {
    // guardar el usuario en la base de datos y devolver el ID
    db.run(
        'INSERT INTO users VALUES (?, ?, ?, ?)', [
            req.params.login,
            req.params.name,
            req.params.email,
            req.params.passwd
        ],
        function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.end();
            }
        }
    );
};

// Modificar los datos de un usuario
const userPut = async(req = request, res = response) => {
    res.send('Got a PUT request at /user');
};

// Borrar un usuario
const userDelete = async(req = request, res = response) => {
    // Borrar primero todas los registros de tablas con claves de usuario
    // DELETE FROM usertasks WHERE user=?
    // DELETE FROM runs WHERE user=?
    // DELETE FROM sessions WHERE user=?

    // Borrar el usuario en la base de datos
    db.run('DELETE FROM users WHERE id=?', req.params.id);

    res.end();
};

// Listar todos los usuarios
const usersGet = async(req = request, res = response) => {
    db.all(
        'SELECT id, login, name, email FROM users',
        function(err, rows) {
            if (err) {
                res.status(500).send("error: " + err);
            } else {
                res.json(rows);
            }
        }
    );
};

module.exports = {
    userGet,
    userPost,
    userPost,
    userPut,
    userDelete,
    usersGet
}