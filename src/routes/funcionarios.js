const Router = require("express");
const router = Router();

const database = require("./../database");
const util = require("./../util");
const argon2 = require("argon2");

router.post("/", async (req, res) => {
    const { idfuncionario, nombres, apellidos, idcargo, ci, telefono, password, activo, accesoSistema } = req.body;
    try {
        const hash = await argon2.hash(password);
        database.query(`INSERT INTO funcionario(idfuncionario, telefono, ci, idcargo, password, nombres, apellidos, activo, acceso_sistema)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`, [idfuncionario, telefono, ci, idcargo, hash, nombres, apellidos, activo, accesoSistema],
            (err, rows, fields) => {
                if (!err) {
                    res.sendStatus(204);
                } else {
                    console.log(err);
                    res.status(500).send(util.mysqlMsgToHuman(err));
                }
            });
    } catch (err) {
        console.log("Error al calcular hash");
        console.log(err);
        res.status(500).send("Error al cifrar contraseña");
    }

});

router.get("/", (req, res) => {
    database.query("SELECT * FROM vw_funcionarios", (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.put("/", async (req, res) => {
    const { idfuncionario, nombres, apellidos, idcargo, ci, telefono, password, activo, accesoSistema } = req.body;
    if (password) {
        try {
            const hash = await argon2.hash(password);
            database.query(`UPDATE funcionario SET nombres = ?,
            apellidos = ?,
            idcargo = ?,
            ci = ?, 
            telefono = ?,
            password = ?,
            activo = ?,
            acceso_sistema = ?
            WHERE idfuncionario = ?`, [nombres, apellidos, idcargo, ci, telefono, hash, activo, accesoSistema, idfuncionario],
                (err, rows, fields) => {
                    if (!err) {
                        res.sendStatus(204);
                    } else {
                        console.log(err);
                        res.status(500).send(util.mysqlMsgToHuman(err));
                    }
                });
        } catch (err) {
            console.log("Error al calcular HASH");
            console.log(err);
            res.status(500).send("Error al calcular Hash de la contraseña");
        }
    } else {
        database.query(`UPDATE funcionario SET nombres = ?,
            apellidos = ?,
            idcargo = ?,
            ci = ?, 
            telefono = ?,
            activo = ?,
            acceso_sistema = ?
            WHERE idfuncionario = ?`, [nombres, apellidos, idcargo, ci, telefono, activo, accesoSistema, idfuncionario],
            (err, rows, fields) => {
                if (!err) {
                    res.sendStatus(204);
                } else {
                    console.log(err);
                    res.status(500).send(util.mysqlMsgToHuman(err));
                }
            });
    }
});

router.delete("/:idfuncionario", (req, res) => {
    const { idfuncionario } = req.params;
    database.query("DELETE FROM funcionario WHERE idfuncionario = ?", [idfuncionario], (err, rows, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

module.exports = router;