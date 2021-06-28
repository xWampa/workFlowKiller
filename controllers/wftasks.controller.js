const { response, request } = require('express');
const { db } = require('../database/config');
const router = require('../routes/login.routes');

//Crea una nueva entrada en la tabla run, del proceso pasado en el body (y en caso de ser necesario usertask si fuera un subproceso), y además añade a usertasks todas las tareas correspondientes a ese proceso.
const wftaskGet = async(req = request, res = response) => {

    const sql = 'INSERT into runs (workflow, user, state, usertask) VALUES (?, ?, 2, ?)';

    db.run(sql, [

        req.body.workflow,
        req.session.userID, 
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

                            var sq2 = "";
                            //Añadimos todas las usertasks correspondientes al proceso
                            tasks.forEach(task => {

                                var estado = 1;

                                if (task.order == tasks[0].order) estado = 2;
                                if (task == tasks[0])
                                    sq2 = `INSERT INTO usertasks (run, user, wftask, state) VALUES (${runid}, ${req.body.userID}, ${task.id}, ${estado})`;
                                else
                                    sq2 += `,(${runid}, ${req.session.userID}, ${task.id}, ${estado})`; 

                            });

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
    wftaskGet
}