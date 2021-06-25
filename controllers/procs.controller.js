const { response, request } = require('express');
const { db } = require('../database/config');


// Devuelve todos los procesos en ejecución por el usuario
const procsGet = async(req = request, res = response) => {

    const sql = 'SELECT wf.id, wf.name FROM workflows AS wf, runs AS r WHERE r.user=? AND r.workflow = wf.id AND r.state=2';
    const userID = req.session.userID;
    db.all(sql, userID, function(err, rows) {
        if (err) {
            res.send(err)
        } else {
            res.json(rows);
        }

    });
}

module.exports = {
    procsGet
}