const { Router } = require("express");
const router = Router();

const database = require("./../database");
const util = require("./../util");

router.get("/", (req, res) => {
    database.query("SELECT idservicio, nombre, precio, porcentaje_iva AS iva FROM servicio", (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.post("/", (req, res) => {
    const { idservicio, nombre, precio, iva } = req.body;
    database.query(`INSERT INTO servicio(idservicio, nombre, precio, porcentaje_iva)
    VALUES(?, ?, ?, ?)`, [idservicio, nombre, precio, iva], (err, rows, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.put("/", (req, res) => {
    const { idservicio, nombre, precio, iva } = req.body;
    database.query("UPDATE servicio SET nombre = ?, precio = ?, porcentaje_iva = ? WHERE idservicio = ?", 
    [nombre, precio, iva, idservicio],
    (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204)
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.delete("/:idservicio", (req, res)=>{
    const { idservicio } = req.params;
    database.query("DELETE FROM servicio WHERE idservicio = ?", [idservicio], (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

module.exports = router;