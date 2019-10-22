const { Router } = require("express");
const router = Router();
const util = require("./../util");
const database = require("./../database");

router.post("/", (req, res) => {
    const { idmodelo, nombre, idmarca } = req.body;
    database.query(`INSERT INTO 
    modelo(idmodelo, nombre, idmarca) 
    VALUES(?, ?, ?)`, [idmodelo, nombre, idmarca], (err, rows, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.get("/", (req, res) => {
    const { idmarca } = req.query;
    console.log('la marca recibida es: ' + idmarca);
    let query = "SELECT * FROM vw_modelos";
    if (idmarca != null) {
        query = `SELECT * FROM vw_modelos WHERE idmarca = ${idmarca}`;
    }
    database.query(query, (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.put("/:idmodelo", (req, res) => {
    const { nombre, idmarca } = req.body;
    const { idmodelo } = req.params;
    database.query(`UPDATE modelo SET nombre = ?, idmarca = ? WHERE idmodelo = ?`,
        [nombre, idmarca, idmodelo], (err, rows, fields) => {
            if (!err) {
                res.sendStatus(204);
            } else {
                console.log(err);
                res.status(500).send(util.mysqlMsgToHuman(err));
            }
        });
});

router.delete("/:idmodelo", (req, res) => {
    const { idmodelo } = req.params;
    database.query("DELETE FROM modelo WHERE idmodelo = ?", [idmodelo], (err, rows, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

module.exports = router;