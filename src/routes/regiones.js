const { Router } = require("express");
const router = Router();

const mysqlConnection = require("../database");
const util = require('./../util');

router.get("/", (req, res) => {
    mysqlConnection.query("SELECT * FROM region", (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    mysqlConnection.query("SELECT * FROM region WHERE idregion = ?", [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.post("/", (req, res) => {
    console.log(req.body);
    const { idregion, nombre } = req.body;
    mysqlConnection.query("INSERT INTO region (idregion, nombre) VALUES(?, ?)", [idregion, nombre], (err, rows, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.put("/:id", (req, res) => {
    const { nombre } = req.body;
    const { id } = req.params;
    mysqlConnection.query("UPDATE region SET nombre = ? WHERE idregion = ?", [nombre, id], (err, rows, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    mysqlConnection.query("DELETE FROM region WHERE idregion = ?", [id], (err, rows, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

module.exports = router;