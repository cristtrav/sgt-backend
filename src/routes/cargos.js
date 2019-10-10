const { Router } = require("express");
const router = Router();

const database = require("./../database");
const util = require("./../util");

router.get("/", (req, res) => {
    database.query("SELECT * FROM cargo", (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.post("/", (req, res) => {
    const { idcargo, nombre } = req.body;
    database.query("INSERT INTO cargo(idcargo, nombre) VALUES(?, ?)", [idcargo, nombre], (err, rows, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.delete("/:idcargo", (req, res) => {
    const { idcargo } = req.params;
    database.query("DELETE FROM cargo WHERE idcargo = ?", [idcargo], (err, rows, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.put("/", (req, res) => {
    const { idcargo, nombre } = req.body;
    database.query("UPDATE cargo SET nombre = ? WHERE idcargo = ?", [nombre, idcargo], (err, rows, fields) => {
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

module.exports = router;