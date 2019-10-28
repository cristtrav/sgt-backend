const { Router } = require("express");
const router = Router();

const database = require("./../database");
const util = require("./../util");

router.post("/", (req, res) => {
    console.log(req.body);
    const { fechaPedido, fechaRecepcion, total, idproveedor, detallepedido, idfuncionario } = req.body;
    const fp = new Date(fechaPedido);
    const strfp = `${fp.getFullYear()}-${fp.getMonth() + 1}-${fp.getDate()}`;
    let strfr = null;
    let recibido = 0;
    if (fechaRecepcion != null) {
        recibido = 1;
        const fr = new Date(fechaRecepcion);
        strfr = `${fr.getFullYear()}-${fr.getMonth() + 1}-${fr.getDate()}`;
    }
    database.beginTransaction();
    try {

        database.query(`INSERT INTO pedido_proveedor(fecha_pedido, fecha_recepcion, total, recibido, idproveedor, idfuncionario)
            VALUES(?, ?, ?, ?, ?, ?)`, [strfp, strfr, total, recibido, idproveedor, idfuncionario], (err, result, fields) => {
            if (err) {
                throw new Error(err);
            } else {
                const idpedido = result.insertId;
                for (dp of detallepedido) {
                    const { subtotal, cantidad, precio, idrepuesto } = dp;
                    database.query(`INSERT INTO detalle_pedido_proveedor(subtotal, cantidad, precio, idrepuesto, idpedido)
                    VALUES(?, ?, ?, ?, ?)`, [subtotal, cantidad, precio, idrepuesto, idpedido], (err, result, fields) => {
                        if (err) {
                            throw new Error(err);
                        }
                    });
                }
            }
        });
        database.commit();
        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        database.rollback();
        res.status(500).send(util.mysqlMsgToHuman(err));
    }
});

router.get("/", (req, res) => {
    database.query("SELECT * FROM vw_pedidos_proveedores", (err, result, fields) => {
        if (!err) {
            res.json(result);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.get("/:idpedido", (req, res) => {
    const { idpedido } = req.params;
    database.query("SELECT * FROM vw_pedidos_proveedores WHERE idpedido = ?", [idpedido], (err, result, fields) => {
        if (!err) {
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).send({ error: "No encontrado" });
            }

        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.delete("/:idpedido", (req, res) => {
    const { idpedido } = req.params;
    database.beginTransaction();
    try {
        database.query("DELETE FROM detalle_pedido_proveedor WHERE idpedido = ?", [idpedido], (err, result, fields) => {
            if (err) throw new Error(err);
        });
        database.query("DELETE FROM pedido_proveedor WHERE idpedido = ?", [idpedido], (err, result, fields) => {
            if (err) throw new Error(err);
        });
        database.commit();
        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        database.rollback();
        res.status(500).send(util.mysqlMsgToHuman(err));
    }
});

router.get("/:idpedido/detalles", (req, res) => {
    const { idpedido } = req.params;
    database.query(`SELECT * FROM vw_detalle_pedidos_proveedores WHERE idpedido = ?`,
        [idpedido], (err, result, fields) => {
            if (!err) {
                res.json(result);
            } else {
                console.log(err);
                res.status(500).send(util.mysqlMsgToHuman(err));
            }
        });
});

router.put("/", (req, res)=>{
    console.log(req.body);
    const { idpedido, fechaPedido, fechaRecepcion, total, idproveedor, detallepedido, idfuncionario } = req.body;
    const fp = new Date(fechaPedido);
    const strfp = `${fp.getFullYear()}-${fp.getMonth() + 1}-${fp.getDate()}`;
    let strfr = null;
    let recibido = 0;
    if (fechaRecepcion != null) {
        recibido = 1;
        const fr = new Date(fechaRecepcion);
        strfr = `${fr.getFullYear()}-${fr.getMonth() + 1}-${fr.getDate()}`;
    }
    console.log('fecha recepcion str: '+strfr);
    database.beginTransaction();
    try {
        database.query("DELETE FROM detalle_pedido_proveedor WHERE idpedido = ?", [idpedido], (err, result, fields)=>{
            if(err) throw new Error(err);
        });
        for (dp of detallepedido) {
            const { subtotal, cantidad, precio, idrepuesto } = dp;
            database.query(`INSERT INTO detalle_pedido_proveedor(subtotal, cantidad, precio, idrepuesto, idpedido)
            VALUES(?, ?, ?, ?, ?)`, [subtotal, cantidad, precio, idrepuesto, idpedido], (err, result, fields) => {
                if (err) throw new Error(err);
            });
        }
        database.query(`UPDATE pedido_proveedor SET
        fecha_pedido = ?,
        fecha_recepcion = ?,
        total = ?,
        recibido = ?,
        idproveedor = ?,
        idfuncionario = ? WHERE idpedido = ?`, [strfp, strfr, total, recibido, idproveedor, idfuncionario, idpedido], (err, result, fields) => {
            if (err) throw new Error(err);
        });
        database.commit();
        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        database.rollback();
        res.status(500).send(util.mysqlMsgToHuman(err));
    }
});

module.exports = router;