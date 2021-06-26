const { response, request } = require('express');
const { db } = require('../database/config');

// Devuelve todos los nuevos procesos disponibles para iniciar por el usuario
const runsGet = async(req = request, res = response) => {

    const sql = 'SELECT DISTINCT wf.id, wf.name FROM workflows AS wf, runs AS r, tasks as t WHERE wf.id NOT IN (SELECT DISTINCT r.workflow FROM runs) AND wf.id NOT IN (SELECT DISTINCT t.workflow FROM tasks)';
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
    console.log(req.session.userID);
    const sql = 'INSERT into runs (workflow, user, state, usertask) VALUES (?, ?, 2, ?)';

    db.run(sql, [

        req.body.workflow,
        req.session.userID, // CAMBIAR A SESSION!!!!
        req.body.usertask

    ], function(err, rows) {
        if (err) {
            res.status(500).send(err)
        } else {

            var sql = 'SELECT wft.*  FROM wftasks AS wft WHERE (wft.workflow = ?) ORDER BY "order"';

            db.all(sql, req.body.workflow, async function(err, rows) {
                if (err) {
                    res.status(500).send(err);
                } else {

                    // Aquí, una vez tenemos todos los wftasks de un proceso nuevo en run, las metemos todas en usertasks, poniendo la/s primera/s como pendiente y el resto en programada

                    sql = 'SELECT r.id FROM runs AS r WHERE ? = r.workflow'

                    var tasks = rows;

                    db.all(sql, req.body.workflow, async function(err, rows) {
                        if (err) {
                            res.status(500).send(err)
                        } else {

                            var runid = rows[0].id;

                            // tasks.forEach(task => {
                            //     console.log(task);
                            //     var estado = 1;
                            //     if (task.order == tasks[0].order) estado = 2;

                            //     var sq2 = `INSERT INTO usertasks (run, user, wftask, state) VALUES (${runid}, ${req.body.userID}, ${task.id}, ${estado})`;
                            //     console.log(sq2);

                            //     db.run(sq2, function(err, rows) {
                            //         if (err) {
                            //             res.status(500).send(err);
                            //         } else {
                            //             console.log(`bien la task: ${task.data}`)
                            //         }
                            //     });

                            // });

                            var sq2 = "";
                            tasks.forEach(task => {

                                var estado = 1;

                                if (task.order == tasks[0].order) estado = 2;
                                if (task == tasks[0])
                                    sq2 = `INSERT INTO usertasks (run, user, wftask, state) VALUES (${runid}, ${req.session.userID}, ${task.id}, ${estado})`;
                                else
                                    sq2 += `,(${runid}, ${req.session.userID}, ${task.id}, ${estado})`; // CAMBIAR BODY A SESSION !!!

                            });

                            console.log(sq2);

                            db.run(sq2, function(err, rows) {
                                
                                if (err) {
                                    
                                    res.status(500).send(err);

                                } else {
                                    res.send(`todas las usertask del proceso con id ${req.body.workflow} en marcha con id ${runid} han sido añadidas a tabla usertasks`)
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
    runPost
}