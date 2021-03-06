const { Router } = require("express");
const router = Router();

const mysqlConnection = require("../database");
const util = require("./../util");

router.get("/", (req, res) => {
    const { limit, offset } = req.query;
    let sqlQuery = "SELECT * FROM vw_ciudades_departamentos";
    if (limit != null) {
        if(offset != null){
            sqlQuery += " LIMIT " + Number(limit)+ " OFFSET "+Number(offset);
        }else{
            sqlQuery += " LIMIT " + Number(limit);    
        }
        
    }
    mysqlConnection.query(sqlQuery, (err, rows, fields) => {
        if (!err) {
            return res.json(rows);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.post("/", (req, res) => {
    const { idciudad, nombre, iddepartamento } = req.body;
    mysqlConnection.query("INSERT INTO ciudad(idciudad, nombre, iddepartamento) VALUES(?, ?, ?)", [idciudad, nombre, iddepartamento], (err, rows, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.put("/", (req, res) => {    
    const { idciudad, nombre, iddepartamento } = req.body;
    mysqlConnection.query("UPDATE ciudad SET nombre = ? WHERE idciudad = ? AND iddepartamento = ?",
     [nombre, idciudad, iddepartamento], (err, rows, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.delete("/", (req, res) => {
    const { idciudad, iddepartamento } = req.query;
    mysqlConnection.query("DELETE FROM ciudad WHERE idciudad = ? AND iddepartamento = ?",
     [idciudad, iddepartamento], (err, rows, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.get("/total", (req, res) => {
    mysqlConnection.query("SELECT COUNT(*) AS 'total' FROM vw_ciudades_departamentos", (err, rows, fields) => {
        if (!err) {
            return res.send(String(rows[0].total));
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

module.exports = router;