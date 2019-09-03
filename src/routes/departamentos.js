const { Router } = require("express");
const router = Router();

const mysqlConnection = require("../database");
const util = require('./../util');

router.get("/", (req, res)=>{
    mysqlConnection.query("SELECT * FROM vw_departamentos_regiones", (err, rows, fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.post("/", (req, res)=>{
    const {iddepartamento, nombre, idregion} = req.body;
    mysqlConnection.query("INSERT INTO departamento(iddepartamento, nombre, idregion) VALUES(?, ?, ?)", [iddepartamento, nombre, idregion], (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err.sqlMessage);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
})

router.put("/:iddepartamento", (req, res)=>{
    console.log("recibido: ");
    console.log(req.body);
    const { nombre, idregion } = req.body;
    const { iddepartamento } = req.params;
    mysqlConnection.query("UPDATE departamento SET nombre = ?, idregion = ? WHERE iddepartamento = ?", [nombre, idregion, iddepartamento], (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err.sqlMessage);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.delete("/:iddepartamento", (req, res)=>{
    const {iddepartamento} = req.params;
    mysqlConnection.query("DELETE FROM departamento WHERE iddepartamento = ?", [iddepartamento], (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err.sqlMessage);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});


module.exports = router;