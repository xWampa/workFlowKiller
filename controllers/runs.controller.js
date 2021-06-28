const { response, request } = require('express');
const { db } = require('../database/config');

// Devuelve todos los nuevos procesos disponibles para iniciar por el usuario
const runsGet = async(req = request, res = response) => {

    const sql = 'SELECT wf.id, wf.name FROM workflows AS wf WHERE wf.id = (SELECT workflow FROM runs WHERE state="3") OR NOT EXISTS (SELECT r.workflow FROM runs AS r WHERE r.workflow = wf.id ) AND NOT EXISTS (SELECT t.workflow FROM tasks AS t WHERE t.workflow = wf.id)';
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

// Añade entrada nueva en la tabla run y todas sus tareas correspondientes a la tabla usertasks, poniendo la/s primera/s en estado pendiente y las demas en programadas. Coge id de workflow del body
const runPost = async(req = request, res = response) => {
    //console.log(req.session.userID);

    newRun(req, res);


    // workflow = req.body.workflow;
    // userID = req.session.userID; // CAMBIAR A SESSION!!!!
    // usertask = req.body.usertask;

    // var sql = 'INSERT into runs (workflow, user, state, usertask) VALUES (?, ?, 2, ?)';

    // db.run(sql, [

    //     workflow,
    //     userID, // CAMBIAR A SESSION!!!!
    //     usertask

    // ], function(err, rows) {
    //     if (err) {
    //         res.status(500).send(err)
    //     } else {

    //         sql = 'SELECT wft.*  FROM wftasks AS wft WHERE (wft.workflow = ?) ORDER BY "order"';

    //         db.all(sql, workflow, async function(err, rows) {
    //             if (err) {
    //                 res.status(500).send(err);
    //             } else {

    //                 // Aquí, una vez tenemos todos los wftasks de un proceso nuevo en run, las metemos todas en usertasks, poniendo la/s primera/s como pendiente y el resto en programada

    //                 sql = 'SELECT r.id FROM runs AS r WHERE ? = r.workflow'

    //                 var tasks = rows;

    //                 db.all(sql, workflow, async function(err, rows) {
    //                     if (err) {
    //                         res.status(500).send(err)
    //                     } else {

    //                         var runid = rows[0].id;

    //                         // tasks.forEach(task => {
    //                         //     console.log(task);
    //                         //     var estado = 1;
    //                         //     if (task.order == tasks[0].order) estado = 2;

    //                         //     var sq2 = `INSERT INTO usertasks (run, user, wftask, state) VALUES (${runid}, ${userID}, ${task.id}, ${estado})`;
    //                         //     console.log(sq2);

    //                         //     db.run(sq2, function(err, rows) {
    //                         //         if (err) {
    //                         //             res.status(500).send(err);
    //                         //         } else {
    //                         //             console.log(`bien la task: ${task.data}`)
    //                         //         }
    //                         //     });

    //                         // });

    //                         sql = "";
    //                         tasks.forEach(task => {

    //                             var estado = 1;

    //                             if (task.order == tasks[0].order) estado = 2;
    //                             if (task == tasks[0])
    //                                 sql = `INSERT INTO usertasks (run, user, wftask, state) VALUES (${runid}, ${userID}, ${task.id}, ${estado})`;
    //                             else
    //                                 sql += `,(${runid}, ${userID}, ${task.id}, ${estado})`; // CAMBIAR BODY A SESSION !!!

    //                         });

    //                         //console.log(sq2);

    //                         db.run(sq2, function(err, rows) {

    //                             if (err) {

    //                                 res.status(500).send(err);

    //                             } else {
    //                                 res.send(`todas las usertask del proceso con id ${workflow} en marcha con id ${runid} han sido añadidas a tabla usertasks`)
    //                             }
    //                         });

    //                     }
    //                 });

    //             }
    //         });
    //     }
    // });

}

function newRun(req, res, task_workflow = '', task = '') {

    var workflow = task_workflow || req.body.workflow;
    var userID = req.session.userID; // CAMBIAR A SESSION!!!!
    var usertask = task || req.body.usertask;
    var fechaini = new Date().toLocaleString()


    // crea en runs una nueva entrada del workflow en cuestion
    var sql = 'INSERT into runs (workflow, user, state, usertask) VALUES (?, ?, 2, ?)';

    db.run(sql, [

        workflow,
        userID, // CAMBIAR A SESSION!!!!
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

                            // tasks.forEach(task => {
                            //     console.log(task);
                            //     var estado = 1;
                            //     if (task.order == tasks[0].order) estado = 2;

                            //     var sq2 = `INSERT INTO usertasks (run, user, wftask, state) VALUES (${runid}, ${userID}, ${task.id}, ${estado})`;
                            //     console.log(sq2);

                            //     db.run(sq2, function(err, rows) {
                            //         if (err) {
                            //             res.status(500).send(err);
                            //         } else {
                            //             console.log(`bien la task: ${task.data}`)
                            //         }
                            //     });

                            // });

                            sql = "";
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

                            console.log(sql);

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