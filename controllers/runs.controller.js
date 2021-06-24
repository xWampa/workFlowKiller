const { response, request } = require('express');
const { db } = require('../database/config');

const runsGet = async(req = request, res = response) => {

    const sql = 'select * from workflows where workflows.id not in (select workflow from runs)';
    //const userID = req.session.userID;
    db.all(sql, function(err, rows) {
        res.json(rows);
    });
}
const runsPost = async(req = request, res = response) => {
    // asignar un proceso creando registro en tabla runs
    db.run(
        'INSERT INTO runs ("workflow", "user", "state", "usertask") VALUES (?, ?, ?, ?)', [
            req.body.workflow,
            req.body.user,
            req.body.state,
            req.body.usertask
        ],
        function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(`El proceso ${req.body.workflow} ha sido añadido con éxito`);
            }
        }
    );
};

module.exports = {
    runsGet,
    runsPost
}