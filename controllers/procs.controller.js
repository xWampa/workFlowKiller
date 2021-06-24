const { response, request } = require('express');
const { db } = require('../database/config');

const procsGet = async(req = request, res = response) => {

    const sql = 'SELECT wf.id AS id, wf.name AS name, r.workflow AS flujo, r.state AS estado, r.user AS usuario FROM workflows AS wf, runs AS r WHERE r.user=? GROUP BY r.workflow';
    const userID = req.session.userID;
    db.all(sql, userID, function(err, rows) {
        res.json(rows);
    });
}


module.exports = {
    procsGet
}