const { response, request } = require('express');
const { db } = require('../database/config');

const todoGet = async(req = request, res = response) => {

    const sql = 'SELECT name FROM workflows';
    
    db.all(sql, function(err, rows) {
        res.json(rows);
    });
}

module.exports = {
    todoGet
}