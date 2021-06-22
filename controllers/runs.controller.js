const { response, request } = require('express');
const { db } = require('../database/config');

const runsGet = async(req = request, res = response) => {

    const sql = 'SELECT DISTINCT wf.id AS id, wf.name AS name, r.workflow AS flujo FROM workflows AS wf, runs AS r WHERE wf.id NOT IN (SELECT DISTINCT r.workflow AS flujo FROM runs AS r)';
    //const userID = req.session.userID;
    db.all(sql, function(err, rows) {
        res.json(rows);
    });
}

module.exports = {
    runsGet
}