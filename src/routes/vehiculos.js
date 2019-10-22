const { Router } = require("express");
const router = Router();

const database = require("./../database");
const util = require("./../util");

router.post("/", (req, res)=>{
    const { idvehiculo, cipropietario, idmodelo, fechaIngreso, observacion, color, chapa, anioModelo } = req.body;
    const fi = new Date(fechaIngreso);
    const strFi = `${fi.getFullYear()}-${fi.getMonth() + 1}-${fi.getDate()}`;
    database.query(`INSERT INTO vehiculo(idvehiculo, propietario, modelo, chapa, color, fecha_ingreso, observacion, anio)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, [idvehiculo, cipropietario, idmodelo, chapa, color, strFi, observacion, anioModelo],
    (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.get("/", (req, res)=>{
    database.query("SELECT * FROM vw_vehiculos", (err, rows, fields)=>{
        if(!err){
            res.json(rows);
        }else{
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.put("/", (req, res)=>{
    const { idvehiculo, cipropietario, idmodelo, fechaIngreso, observacion, color, chapa, anioModelo } = req.body;
    const fi = new Date(fechaIngreso);
    const strFi = `${fi.getFullYear()}-${fi.getMonth() + 1}-${fi.getDate()}`;
    database.query(`UPDATE vehiculo SET propietario = ?,
    modelo = ?,
    fecha_ingreso = ?,
    color = ?,
    chapa = ?,
    observacion = ?,
    anio = ? WHERE idvehiculo = ?`, [cipropietario, idmodelo, strFi, color, chapa, observacion, anioModelo, idvehiculo], (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.delete("/:idvehiculo", (req, res)=>{
    const { idvehiculo } = req.params;
    database.query("DELETE FROM vehiculo WHERE idvehiculo = ?", [idvehiculo], (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

module.exports = router;