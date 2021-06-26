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

const procsPost = async(req = request, res = response) => {

    console.log(req.body.workflow)

    var sql = "DELETE FROM usertasks WHERE run = (SELECT id FROM runs WHERE workflow = ?)";
    db.run(sql, req.body.workflow, function(err){
        if(err){
            res.status(500).send(err);
        }else{
            //res.send('Proceso borrado de usertasks');
            sql = "DELETE FROM runs WHERE workflow = ?";
            db.run(sql, req.body.workflow, function(err){
                if(err){
                    res.status(500).send(err);
                }else{
                    res.send('Proceso borrado');
                }
            });

        }
    });
}

module.exports = {
    procsGet,
    procsPost
}