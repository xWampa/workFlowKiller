const { response, request } = require('express');
const { db } = require('../database/config');

// Devuelve todos los nuevos procesos disponibles para iniciar por el usuario
const runsGet = async(req = request, res = response) => {

    const sql = 'SELECT wf.id, wf.name FROM workflows AS wf WHERE NOT EXISTS (SELECT r.workflow FROM runs AS r WHERE r.workflow = wf.id ) AND NOT EXISTS (SELECT t.workflow FROM tasks AS t WHERE t.workflow = wf.id)';
    //const userID = req.session.userID;
    db.all(sql, function(err, rows) {
        res.json(rows);
    });
}

// Añade entrada nueva en la tabla run y todas sus tareas correspondientes a la tabla usertasks, poniendo la/s primera/s en estado pendiente y las demas en programadas. Coge id de workflow del body
const runPost = async(req = request, res = response) => {
    //console.log(req.session.userID);

    newRun(req, res);
}

function newRun(req, res, task_workflow = '', task = '') {

    var workflow = task_workflow || req.body.workflow;
    var userID = req.session.userID; 
    var usertask = task || req.body.usertask;
    var fechaini = new Date().toLocaleString()


    // crea en runs una nueva entrada del workflow en cuestion
    var sql = 'INSERT into runs (workflow, user, state, usertask) VALUES (?, ?, 2, ?)';

    db.run(sql, [

        workflow,
        userID, 
        usertask

    ], function(err, rows) {
        if (err) {
            res.status(500).send(`error al crear nuevo run: ${err}`)
        } else {
            // selecciona todos los wftasks del workflow en cuestion
            sql = 'SELECT wft.*  FROM wftasks AS wft WHERE (wft.workflow = ?) ORDER BY "order"';

            db.all(sql, workflow, async function(err, rows) {
                if (err) {
                    res.status(500).send(`error al seleccionar wftasks: ${err}`);
                } else {

                    // Aquí, una vez tenemos todos los wftasks de un proceso nuevo en run, las metemos todas en usertasks, poniendo la/s primera/s como pendiente y el resto en programada

                    // selecciona el run recien creado
                    sql = 'SELECT r.id FROM runs AS r WHERE ? = r.workflow'

                    var tasks = rows;

                    db.all(sql, workflow, async function(err, rows) {
                        if (err) {
                            res.status(500).send(`error al seleccionar el run: ${err}`)
                        } else {

                            var runid = rows[0].id;

                            sql = "";
                            //Añadimos las entradas usertasks correspondientes al proceso
                            tasks.forEach(task => {

                                var estado = 1;
                                var fechainicio = '';
                                if (task.order == tasks[0].order) {
                                    estado = 2;
                                    fechainicio = fechaini;
                                }
                                if (task == tasks[0])
                                    sql = `INSERT INTO usertasks (run, user, wftask, state, fechainicio) VALUES (${runid}, ${userID}, ${task.id}, ${estado}, "${fechainicio}")`;
                                else
                                    sql += `,(${runid}, ${userID}, ${task.id}, ${estado}, "${fechainicio}")`;

                            });

                            // console.log(sql);

                            db.run(sql, function(err, rows) {

                                if (err) {

                                    res.status(500).send(`error al crear usertasks: ${err}`);

                                } else {
                                    res.send(`todas las usertask del proceso con id ${workflow} en marcha con id ${runid} han sido añadidas a tabla usertasks`)
                                }
                            });

                        }
                    });

                }
            });
        }
    });


}

module.exports = {
    runsGet,
    runPost,
    newRun
}