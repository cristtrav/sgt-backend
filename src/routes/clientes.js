const { Router } = require("express");
const router = Router();

const database = require("./../database");
const util = require("./../util");

router.post("/", (req, res)=>{
    console.log(req.body);
    const { ci, nombres, apellidos, telefono, dvRuc, idciudad, fechaIngreso } = req.body;
    const fi = new Date(fechaIngreso);
    const strFi=`${fi.getFullYear()}-${fi.getMonth()+1}-${fi.getDate()}`;
    database.query(`INSERT INTO 
    cliente(ci, nombres, apellidos, telefono, dv_ruc, idciudad, fecha_registro) 
    VALUES(?, ?, ?, ?, ?, ?, ?)`, [ci, nombres, apellidos, telefono, dvRuc, idciudad, strFi], (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.put("/:ci", (req,res)=>{
    console.log(req.body);
    const { nombres, apellidos, telefono, dvRuc, idciudad, fechaIngreso } = req.body;
    const { ci } = req.params;
    const fi = new Date(fechaIngreso);
    const strFi=`${fi.getFullYear()}-${fi.getMonth()+1}-${fi.getDate()}`;
    console.log("string date: "+strFi);
    database.query(`UPDATE cliente SET nombres = ?, apellidos = ?, telefono = ?, dv_ruc = ?, idciudad = ?, fecha_registro = ? 
    WHERE ci = ?`, [nombres, apellidos, telefono, dvRuc, idciudad, strFi, ci], (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.get("/", (req, res)=>{
    database.query("SELECT * FROM vw_clientes_ciudades_departamentos", (err, rows, fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.delete("/:ci", (req, res)=>{
    const { ci } = req.params;
    database.query("DELETE FROM cliente WHERE ci = ?", [ci], (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

module.exports = router;