const { response, request } = require('express');
const { db } = require('../database/config');

const { newRun } = require('./runs.controller');


var utask = '';

// Devuelve las tareas del usuario que no están pendientes (bien están terminadas o programadas)
const tasksGet = async(req = request, res = response) => {

    // const sql = 'SELECT ut.id AS id, ut.state AS state, t.name AS name, wt.data AS data FROM usertasks AS ut, wftasks AS wt, tasks AS t WHERE ut.user=? AND (ut.state=1 OR ut.state=3) AND ut.wftask=wt.id AND wt.task=t.id';
    //Con esta consulta se sacan todas las tareas del usuario, ordenadas primero por proceso, y luego por orden de tarea. Además saca si una tarea es subproceso (mejor probar en base de datos para ver lo q saca)
    const sql = 'SELECT wt."order", ut.id AS usertask_id, ut.state, t.name, wt.data, t.workflow AS subproceso, wf.name AS proceso, wf.id AS id_proceso, ut.fechainicio, ut.fechafin, ut.horas,ut.notes FROM usertasks AS ut, wftasks AS wt, tasks AS t, workflows AS wf WHERE ut.user = ? AND ut.wftask = wt.id AND wt.task = t.id AND wf.id = wt.workflow ORDER by id_proceso, "order"';
    const userID = req.session.userID;
    db.all(sql, userID, function(err, rows) {
        res.json(rows);
    });
}

// const taskComplet = async(req = request, res = response) => {

//     const usertaskID = utask || req.body.usertaskID;
//     utask = '';


//     // Devuelve filas con mismo orden que la del id de usertask y mismo workflow....y con estado pendiente
//     // sql = 'SELECT wt.*, ut.id AS ut_id, ut.state FROM usertasks AS ut, wftasks AS wt WHERE ut.id = 58 AND wt."order" = (SELECT "order" FROM wftasks WHERE id = ut.wftask) AND wt.workflow = (SELECT workflow FROM wftasks WHERE id=ut.wftask) AND ut.state = 2'
//     // Devuelve la cuenta (cuantos con mismo order), el workflow y el valor de order en si, de las tareas con mismo workflow, estado pendiente y con mismo order que la que estamos mirando
//     sql = 'SELECT count(*) AS count, wt.workflow, wt."order" FROM usertasks AS ut, wftasks AS wt WHERE ut.id = ? AND wt."order" = (SELECT "order" FROM wftasks WHERE id = ut.wftask) AND wt.workflow = (SELECT workflow FROM wftasks WHERE id=ut.wftask) AND ut.state = 2'

//     db.all(sql, usertaskID, function(err, rows) {
//         if (err) {
//             res.status(500).send(err);
//         } else {
//             //aquí tenemos el numero de resultados
//             var count = rows[0].count;
//             var workflow = rows[0].workflow;
//             var order = rows[0].order;

//             // Ahora hacemos un update solo para cambiar el estado de la usertask en cuestión a 3: terminada
//             var sql = 'UPDATE usertasks SET state = 3  WHERE id=?';

//             db.run(sql, usertaskID, function(err, rows) {

//                 if (err) {
//                     res.status(500).send(err);
//                 } else {

//                     if (count > 1) {
//                         res.send(`cambiado estado de tarea de usuario con id ${usertaskID}`)
//                     } else {
//                         //Aquí sabemos que era la única con ese orden y tenemos que continuar haciendo cambios
//                         // Aquí sacamos todas las tareas con order mayor a la actual, del mismo workflow. Sacamos campos [id(de wftasks), workflow(de wftasks), order, task, data, task_name, task_workflow, usertask_id]
//                         sql = 'SELECT wt.*, t.name AS task_name, t.workflow AS task_workflow, ut.id AS usertask_id FROM wftasks AS wt, tasks AS t, usertasks AS ut WHERE wt."order" > ? AND wt.workflow = ? AND t.id = wt.task AND ut.wftask = wt.id ORDER BY "order"';

//                         db.all(sql, [
//                             order,
//                             workflow
//                         ], function(err, rows) {
//                             if (err) {
//                                 res.status(500).send(err);
//                             } else {

//                                 //aquí tenemos una row por cada uno de los wftasks con mismo workflow y order superior al usertask que estamos completando
//                                 if (!rows) {
//                                     // Si no hay con order superior(es la última): cambiar estado del wf en run a terminado, y si tiene algo en campo usertask. Rellamar a la función
//                                     sql = 'UPDATE runs SET state = 1  WHERE workflow = ?';
//                                     db.run(sql, workflow, function(err, rows) {

//                                         if (err) {
//                                             res.status(500).send(err);
//                                         } else {
//                                             sql = 'SELECT r.usertask FROM runs AS r WHERE workflow=?'
//                                             db.all(sql, workflow, function(err, rows) {
//                                                 if (err) {
//                                                     res.status(500).send(err);
//                                                 } else {
//                                                     utask = rows[0].usertask;

//                                                     if (!utask) {
//                                                         res.send(`proceso ${workflow} terminado`)
//                                                     } else {
//                                                         taskComplet(req, res)
//                                                     }
//                                                 }
//                                             })
//                                         }

//                                     })

//                                 } else {
//                                     // Si sí que hay tareas del mismo workflow, de orden superior, nos quedamos con las que sean de orden inmediatamente superior (todavía no sé como) y continuamos
//                                     var iorder = rows[0].order;

//                                     var tareas = [];

//                                     rows.forEach(tarea => { if (tarea.order == iorder) tareas.push(tarea); }); // campos tanto de wftasks como de tasks (con todos sus campos)
//                                     //Cambiar estado de usertasks con orden inmediatamente superior a pendiente

//                                     tareas.forEach(tarea => {
//                                         if (tarea == tareas[0])
//                                             sql = `UPDATE usertasks SET state = 2 WHERE wftask = ${tarea.id}`;
//                                         else
//                                             sql += ` OR wftask = ${tarea.id}`
//                                     });

//                                     db.run(sql, function(err, rows) {

//                                         if (err) {
//                                             res.status(500).send(err);
//                                         } else {
//                                             //Comprobar si cada task de las entradas de la tabla wftasks que tenemos, alguna/s son subproceso/s
//                                             tareas.forEach(tarea => {
//                                                 if (tarea.task_workflow) {
//                                                     //llamada a funcion de run nuevo con campo body.workflow : task_workflow y campo body.usertask : task
//                                                     newRun(req, res, tarea.task_workflow, tarea.task)
//                                                 } else {
//                                                     res.send(`completada tarea actual y actualizadas tareas siguientes`)
//                                                 }
//                                             });



//                                         }

//                                     })

//                                 }

//                             }
//                         });

//                     }


//                 }
//             });

//         }
//     });
// }


const taskComplet = async(req = request, res = response) => {
    const usertaskID = utask || req.body.usertaskID;
    utask = ''; //cada vez que llamamos a funcion resetea la variable global utask
    const horas = req.body.horas || '';
    const notes = req.body.notes || '';

    // Devuelve filas con mismo orden que la del id de usertask y mismo workflow....y con estado pendiente
    // sql = 'SELECT wt.*, ut.id AS ut_id, ut.state FROM usertasks AS ut, wftasks AS wt WHERE ut.id = 58 AND wt."order" = (SELECT "order" FROM wftasks WHERE id = ut.wftask) AND wt.workflow = (SELECT workflow FROM wftasks WHERE id=ut.wftask) AND ut.state = 2'
    // Devuelve la cuenta (cuantos con mismo order), el workflow y el valor de order en si, de las tareas con mismo workflow, estado pendiente y con mismo order que la que estamos mirando
    // var sql = 'SELECT count(*) AS count, wt.workflow, wt."order" FROM usertasks AS ut, wftasks AS wt WHERE ut.id = ? AND wt."order" = (SELECT "order" FROM wftasks WHERE id = ut.wftask) AND wt.workflow = (SELECT workflow FROM wftasks WHERE id=ut.wftask) AND ut.state = 2'
    var sql = `SELECT count(*) AS count, ut.id AS ut_id, wt.id AS wt_id, wt.workflow, wt."order", ut.state FROM usertasks AS ut, wftasks AS wt WHERE wt.id = ut.wftask AND ut.state = 2 AND wt."order" = (SELECT "order" FROM wftasks as wt, usertasks AS ut WHERE wt.id = ut.wftask AND ut.id = ${usertaskID}) AND wt.workflow = (SELECT workflow FROM wftasks AS wt, usertasks AS ut WHERE wt.id=ut.wftask AND ut.id = ${usertaskID})`

    db.all(sql, function(err, rows) {
        if (err) {
            res.status(500).send(`error en sacar tareas con mismo orden: ${err}`);
            return;
        }
        //aquí tenemos el numero de resultados
        var count = rows[0].count;
        var workflow = rows[0].workflow;
        var order = rows[0].order;

        var fechafin = new Date().toLocaleString();

        // Ahora hacemos un update solo para cambiar el estado de la usertask en cuestión a 3: terminada
        sql = `UPDATE usertasks SET state = 3, fechafin = "${fechafin}", horas = ?, notes = ?  WHERE id=?`;

        db.run(sql, [horas, notes, usertaskID], function(err, rows) {
            if (err) {
                res.status(500).send(`error en cambiar estado de usertask a terminada: ${err}`);
                return;
            }

            console.log(sql);

            if (count > 1) {
                res.send(`cambiado estado de tarea de usuario con id ${usertaskID}`)
            } else {

                //Aquí sabemos que era la única con ese orden y tenemos que continuar haciendo cambios
                // Aquí sacamos todas las tareas con order mayor a la actual, del mismo workflow. Sacamos campos [id(de wftasks), workflow(de wftasks), order, task, data, task_name, task_workflow, usertask_id]
                sql = 'SELECT wt.*, t.name AS task_name, t.workflow AS task_workflow, ut.id AS usertask_id FROM wftasks AS wt, tasks AS t, usertasks AS ut WHERE wt."order" > ? AND wt.workflow = ? AND t.id = wt.task AND ut.wftask = wt.id ORDER BY "order"';

                db.all(sql, [
                    order,
                    workflow
                ], function(err, rows) {
                    if (err) {
                        res.status(500).send(`error en tareas mayores: ${err}`);
                        return;
                    }
                    //aquí tenemos una row por cada uno de los wftasks con mismo workflow y order superior al usertask que estamos completando
                    console.log("las rows son: ", rows);
                    if (rows == undefined || rows == [] || rows == '') {
                        // Si no hay con order superior(es la última): cambiar estado del wf en run a terminado, y si tiene algo en campo usertask. Rellamar a la función
                        sql = 'UPDATE runs SET state = 1  WHERE workflow = ?';
                        db.run(sql, workflow, function(err, rows) {
                            if (err) {
                                res.status(500).send(`error en cambiar estado de run a terminado: ${err}`);
                                return;
                            }
                            sql = 'SELECT r.usertask FROM runs AS r WHERE workflow=?'
                            db.all(sql, workflow, function(err, rows) {
                                if (err) {
                                    res.status(500).send(`error en buscar campo usertask en run: ${err}`);
                                    return;
                                }
                                utask = rows[0].usertask;

                                if (!utask) {
                                    res.send(`proceso ${workflow} terminado`)
                                } else {
                                    taskComplet(req, res)
                                }
                            })
                        })
                    } else {
                        // Si sí que hay tareas del mismo workflow, de orden superior, nos quedamos con las que sean de orden inmediatamente superior y continuamos
                        var iorder = rows[0].order;

                        var tareas = [];

                        rows.forEach(tarea => { if (tarea.order == iorder) tareas.push(tarea); }); // campos tanto de wftasks como de tasks (con todos sus campos)
                        //Cambiar estado de usertasks con orden inmediatamente superior a pendiente

                        tareas.forEach(tarea => {
                            if (tarea == tareas[0])
                                sql = `UPDATE usertasks SET state = 2, fechainicio = "${new Date().toLocaleString()}" WHERE wftask = ${tarea.id}`;
                            else
                                sql += ` OR wftask = ${tarea.id}`
                        });

                        db.run(sql, function(err, rows) {
                            if (err) {
                                res.status(500).send(`error en cambiar estado de inmediatamente superiores: ${err}`);
                                return;
                            }
                            //Comprobar si cada task de las entradas de la tabla wftasks que tenemos, alguna/s son subproceso/s
                            tareas.forEach(tarea => {
                                if (tarea.task_workflow) {
                                    console.log("task_workflow: ", tarea.task_workflow);
                                    console.log("usertask_id: ", tarea.usertask_id);
                                    //llamada a funcion de run nuevo con campo body.workflow : task_workflow y campo body.usertask : task
                                    newRun(req, res, tarea.task_workflow, tarea.usertask_id)
                                } else {
                                    res.send(`completada tarea actual y actualizadas tareas siguientes`)
                                }
                            });
                        })


                    }

                })

            }

        });


    })


};


// var sql = 'UPDATE usertasks SET state = 3  WHERE id=?';

// db.run(sql, usertaskID, function(err, rows) {


//     if (err) {
//         res.status(500).send(err);
//     } else {}
// });

const test = async(req = request, res = response) => {

    // var iorder = 20;

    // rows = [{
    //         id: 11,
    //         workflow: 3,
    //         order: 20,
    //         task: 12,
    //         data: 'dsfsf1'
    //     }, {
    //         id: 12,
    //         workflow: 3,
    //         order: 20,
    //         task: 13,
    //         data: 'dsfsf2'
    //     }, {
    //         id: 13,
    //         workflow: 3,
    //         order: 20,
    //         task: 14,
    //         data: 'dsfsf3'
    //     },
    //     {
    //         id: 14,
    //         workflow: 3,
    //         order: 50,
    //         task: 15,
    //         data: 'dsfsf3'
    //     }
    // ];

    // console.log('rows: ', rows)

    // var tareas = [];

    // rows.forEach(tarea => {
    //     console.log('tarea id: ', tarea.id);
    //     if (tarea.order == iorder) tareas.push(tarea.id);
    //     else {}
    // });

    // console.log('tareas: ', tareas)

    // //Cambiar estado de usertasks con orden inmediatamente superior a pendiente
    // var sql = '';

    // tareas.forEach(tarea => {
    //     if (tarea == tareas[0])
    //         sql = `UPDATE usertasks SET state = 2 WHERE wftask = ${tarea}`;
    //     else
    //         sql += ` OR wftask = ${tarea}`
    // });


    // console.log('sql: ', sql)

    // res.send("todo ok")



    // utask = '168';

    // const usertaskID = utask || req.body.usertaskID;

    // res.send(usertaskID)


    // var sql = '';
    // sql = 'SELECT r.usertask FROM runs AS r WHERE workflow=?'
    // db.all(sql, req.body.workflow, function(err, rows) {
    //     if (err) {
    //         res.status(500).send(err);
    //     } else {
    //         is_sub = rows[0].usertask;
    //         if (is_sub) {
    //             console.log("null lo coge como true");
    //         } else {
    //             console.log("null lo coge como false");
    //         }

    //         res.json(rows)



    //     }
    // });

}

module.exports = {
    tasksGet,
    taskComplet,
    test
}