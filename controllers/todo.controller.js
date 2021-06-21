const { response, request } = require('express');
const { db } = require('../database/config');

const todoGet = async(req = request, res = response) => {

    const sql = 'SELECT ut.id AS id, t.name AS name, wt.data AS data FROM usertasks AS ut, wftasks AS wt, tasks AS t WHERE ut.user=? AND ut.state=2 AND ut.wftask=wt.id AND wt.task=t.id';
    const userID = req.session.userID;
    db.all(sql, userID, function(err, rows) {
        res.json(rows);
    });
}

module.exports = {
    todoGet
}