const { Router } = require("express");
const router = Router();
const util = require("./../util");
const database = require("./../database");

router.get("/", (req, res) => {
    database.query("SELECT * FROM marca", (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.post("/", (req, res) => {
    const { idmarca, nombre } = req.body;
    database.query("INSERT INTO marca(idmarca, nombre) VALUES (?, ?)", [idmarca, nombre], (err, rows, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.put("/:idmarca", (req, res) => {
    const { nombre } = req.body;
    const { idmarca } = req.params;
    database.query("UPDATE marca SET nombre = ? WHERE idmarca = ?", [nombre, idmarca], (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.delete("/:idmarca", (req, res)=>{
    const {idmarca} = req.params;
    database.query("DELETE FROM marca WHERE idmarca = ?", [idmarca], (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        } 
    });
});

module.exports = router;