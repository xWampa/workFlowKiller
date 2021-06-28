const { response, request } = require('express');
const { db } = require('../database/config');


// Devuelve todos los procesos en ejecución por el usuario
const procsGet = async(req = request, res = response) => {

    const sql = 'SELECT wf.id, wf.name, r.usertask FROM workflows AS wf, runs AS r WHERE r.user=? AND r.workflow = wf.id AND r.state=2';
    const userID = req.session.userID;
    db.all(sql, userID, function(err, rows) {
        if (err) {
            res.send(`error al cancelar: ${err}`)
        } else {
            var procesos = [];
            rows.forEach(e => {
                if (!e.usertask) procesos.push(e);
            });
            console.log("procesos: ", procesos);
            res.json(procesos);
        }

    });
}

const procsPost = async(req = request, res = response) => {

    const workflow = req.body.workflow;

    cancelProceso(req, res);

}

function cancelProceso(req, res, workflowID = '') {

    const workflow = workflowID || req.body.workflow;


    sql = `SELECT r.id AS run_id, t.workflow AS subproceso, ut.id AS usertask_id FROM runs AS r, usertasks AS ut, wftasks AS wt, tasks AS t WHERE r.workflow = ${workflow} AND r.id = ut.run AND wt.id = ut.wftask AND t.id = wt.task AND ut.state IN (1,2)`;
    console.log("la conulta es: ", sql)
    db.all(sql, function(err, rows) {
        if (err) {
            res.status(500).send(`error al recuperar usertasks de ese proceso: ${err}`);
        } else {

            // Actualizamos proceso y sus usertasks a estado 4
            var sql = "UPDATE usertasks SET state = '4' WHERE state != '3' AND run = (SELECT id FROM runs WHERE workflow = ?)";
            db.run(sql, workflow, function(err) {
                if (err) {
                    res.status(500).send(`error al cambiar estado de usertasks: ${err}`);
                } else {
                    //res.send('Proceso borrado de usertasks');
                    sql = "UPDATE runs SET state = '4' WHERE workflow = ?";
                    db.run(sql, workflow, function(err) {
                        if (err) {
                            res.status(500).send(`error al cambiar estado de run: ${err}`);
                        }
                    })
                }
            })

            var subprocesses = [];
            console.log("los rows son: ", rows);
            rows.forEach(task => {
                if (task.subproceso != '' & task.subproceso != undefined) subprocesses.push(task);
            });

            if (subprocesses == [] || subprocesses == '' || subprocesses == undefined) {
                res.send("todos los procesos, subprocesos y usertasks cancelados")
                console.log("no hay más subprocesos");
            } else {
                console.log("hay subproceso");
                subprocesses.forEach(element => {
                    cancelProceso(req, res, element.subproceso);
                });
            }

        };

    });


    // if (rows == undefined || rows == "") {
    //     res.send("todos los procesos, subprocesos y usertasks cancelados, no hay mas rows")
    // } else {

    // var subprocesses = [];
    // console.log("los rows son: ", JSON.stringify(rows));
    // rows.forEach(task => {
    //     console.log('tarea de rows: ', task);
    //     if (task.subproceso != '' || task.subproceso != undefined) subprocesses.push(task);
    // });

    // console.log("aqui: ", subprocesses);

    // if (subprocesses == [] || subprocesses == '' || subprocesses == undefined) {
    //     res.send("todos los procesos, subprocesos y usertasks cancelados")
    //     console.log("no hay más subprocesos");
    // } else {
    //     console.log("hay subproceso");
    //     subprocesses.forEach(element => {
    //         cancelProceso(req, res, element.subproceso);
    //     });
    // }


    // }

}

module.exports = {
    procsGet,
    procsPost
}