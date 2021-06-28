const { response, request } = require('express');
const { db } = require('../database/config');


// Devuelve la siguiente tarea/s pendiente/s del usuario
const todoGet = async(req = request, res = response) => {

    const sql = 'SELECT ut.id, t.name, wt.data, ut.wftask AS wftaskID FROM usertasks AS ut, wftasks AS wt, tasks AS t WHERE ut.user=? AND ut.state=2 AND ut.wftask=wt.id AND wt.task=t.id';
    const userID = req.session.userID;
    db.all(sql, userID, function(err, rows) {
        res.json(rows);
    });
}

module.exports = {
    todoGet
}