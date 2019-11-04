const { Router } = require("express");
const router = Router();

const database = require("./../database");
const util = require("./../util");

router.get("/", (req, res) => {
    database.query("SELECT idrepuesto, nombre, precio, stock, stock_minimo AS stockMinimo, porcentaje_iva AS porcentajeIva FROM repuesto", (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.post("/", (req, res)=>{
    const { idrepuesto, nombre, precio, stock, stockMinimo } = req.body;
    database.query("INSERT INTO repuesto (idrepuesto, nombre, precio, stock, stock_minimo) VALUES (?, ?, ?, ?, ?)",
    [idrepuesto, nombre, precio, stock, stockMinimo], (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.put("/", (req, res)=>{
    const { idrepuesto, nombre, precio, stock, stockMinimo } = req.body;
    database.query("UPDATE repuesto SET nombre = ?, precio = ?, stock = ?, stock_minimo = ? WHERE idrepuesto = ?",
    [nombre, precio, stock, stockMinimo, idrepuesto], (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.delete("/:idrepuesto", (req, res)=>{
    const { idrepuesto } = req.params;
    database.query("DELETE FROM repuesto WHERE idrepuesto = ?", [idrepuesto], (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

module.exports = router;