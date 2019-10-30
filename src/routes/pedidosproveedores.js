const { Router } = require("express");
const router = Router();

const database = require("./../database");
const util = require("./../util");

router.post("/", (req, res) => {
    console.log(req.body);
    const { fechaPedido, total, idproveedor, detallepedido, idfuncionarioPedido } = req.body;
    const fp = new Date(fechaPedido);
    const strfp = `${fp.getFullYear()}-${fp.getMonth() + 1}-${fp.getDate()}`;
    database.beginTransaction((e) => {
        if (e) {
            console.log(e);
            res.status(500).send(util.mysqlMsgToHuman(err));
        } else {
            database.query(`INSERT INTO pedido_proveedor(fecha_pedido, total, recibido, idproveedor, idfuncionario_pedido)
            VALUES(?, ?, ?, ?, ?)`, [strfp, total, 0, idproveedor, idfuncionarioPedido], (err, result, fields) => {
                if (err) {
                    console.log(err)
                    res.status(500).send(util.mysqlMsgToHuman(err));
                    database.rollback(() => {
                        throw err;
                    });
                } else {
                    const idpedido = result.insertId;
                    for (dp of detallepedido) {
                        const { subtotal, cantidad, precio, idrepuesto } = dp;
                        database.query(`INSERT INTO detalle_pedido_proveedor(subtotal, cantidad, precio, idrepuesto, idpedido)
                    VALUES(?, ?, ?, ?, ?)`, [subtotal, cantidad, precio, idrepuesto, idpedido], (err, result, fields) => {
                            if (err) {
                                console.log(err)
                                res.status(500).send(util.mysqlMsgToHuman(err));
                                database.rollback(() => {
                                    throw err;
                                });
                            } else {
                                database.commit((error) => {
                                    if (error) {
                                        console.log(err)
                                        res.status(500).send(util.mysqlMsgToHuman(err));
                                        database.rollback(() => {
                                            throw err;
                                        });
                                    } else {
                                        res.sendStatus(204);
                                    }
                                })
                            }
                        });
                    }
                }
            });
        }
    });
});

router.get("/", (req, res) => {
    const { anulado } = req.query;
    let sql = "SELECT * FROM vw_pedidos_proveedores";
    if (anulado != null) {
        sql = `SELECT * FROM vw_pedidos_proveedores WHERE anulado = ${anulado}`;
    }
    database.query(sql, (err, result, fields) => {
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
    database.beginTransaction((e) => {
        if (e) {
            console.log(e);
            res.status(500).send(util.mysqlMsgToHuman(e));
        } else {
            database.query("DELETE FROM detalle_pedido_proveedor WHERE idpedido = ?", [idpedido], (err, result, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(util.mysqlMsgToHuman(err));
                    database.rollback((er) => {
                        throw er;
                    });
                } else {
                    database.query("DELETE FROM pedido_proveedor WHERE idpedido = ?", [idpedido], (err, result, fields) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send(util.mysqlMsgToHuman(err));
                            database.rollback((er) => {
                                throw er;
                            });
                        } else {
                            database.commit((error) => {
                                if (error) {
                                    console.log(error);
                                    res.status(500).send(util.mysqlMsgToHuman(error));
                                    database.rollback((er) => {
                                        throw er;
                                    });
                                } else {
                                    res.sendStatus(204);
                                }
                            })
                        }
                    });
                }
            });
        }
    });
});

router.get("/:idpedido/detalles", (req, res) => {
    const { idpedido } = req.params;
    database.query(`SELECT * FROM vw_detalles_pedidos_proveedores WHERE idpedido = ?`,
        [idpedido], (err, result, fields) => {
            if (!err) {
                res.json(result);
            } else {
                console.log(err);
                res.status(500).send(util.mysqlMsgToHuman(err));
            }
        });
});

router.put("/", (req, res) => {
    console.log(req.body);
    const { idpedido, fechaPedido, fechaRecepcion, fechaAprobacion, total, idproveedor, detallepedido, idfuncionarioPedido, idfuncionarioAprobacion, idfuncionarioRecepcion, recibido, aprobado } = req.body;
    const fp = new Date(fechaPedido);
    const strfp = `${fp.getFullYear()}-${fp.getMonth() + 1}-${fp.getDate()}`;
    let strfr = null;
    let strfa = null;
    if (fechaRecepcion != null) {
        const fr = new Date(fechaRecepcion);
        strfr = `${fr.getFullYear()}-${fr.getMonth() + 1}-${fr.getDate()}`;
    }
    if (fechaAprobacion != null) {
        const fa = new Date(fechaAprobacion);
        strfa = `${fa.getFullYear()}-${fa.getMonth() + 1}-${fa.getDate()}`;
    }

    database.beginTransaction((e) => {
        if (e) {
            console.log(e);
            res.status(500).send(util.mysqlMsgToHuman(e));
        } else {
            database.query(`UPDATE pedido_proveedor SET
            fecha_pedido = ?,
            fecha_aprobacion = ?,
            fecha_recepcion = ?,
            idfuncionario_pedido = ?,
            idfuncionario_aprobacion = ?,
            idfuncionario_recepcion = ?,
            aprobado = ?,
            recibido = ?,
            total = ?,
            idproveedor = ?
            WHERE idpedido = ?`, [strfp, strfa, strfr, idfuncionarioPedido, idfuncionarioAprobacion, idfuncionarioRecepcion, aprobado, recibido, total, idproveedor, idpedido], (err, result, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(util.mysqlMsgToHuman(err));
                    database.rollback((error) => {
                        throw error;
                    });
                } else {
                    database.query("DELETE FROM detalle_pedido_proveedor WHERE idpedido = ?", [idpedido], (err, result, fields) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send(util.mysqlMsgToHuman(err));
                            database.rollback((error) => {
                                throw error;
                            });
                        } else {
                            for (dp of detallepedido) {
                                const { subtotal, cantidad, precio, idrepuesto } = dp;
                                database.query(`INSERT INTO detalle_pedido_proveedor(subtotal, cantidad, precio, idrepuesto, idpedido)
                                VALUES(?, ?, ?, ?, ?)`, [subtotal, cantidad, precio, idrepuesto, idpedido], (err, result, fields) => {
                                    if (err) {
                                        console.log(err);
                                        res.status(500).send(util.mysqlMsgToHuman(err));
                                        database.rollback((error) => {
                                            throw error;
                                        });
                                    }
                                });
                            }
                            database.commit((error) => {
                                if (error) {
                                    console.log(err);
                                    res.status(500).send(util.mysqlMsgToHuman(err));
                                    database.rollback((error) => {
                                        throw error;
                                    });
                                } else {
                                    res.sendStatus(204);
                                }
                            });
                        }
                    });
                }
            });

        }
    });
});

router.post("/:idpedido/aprobacion", (req, res) => {
    const { idpedido } = req.params;
    const { idfuncionarioAprobacion, fechaAprobacion } = req.body;
    const fa = new Date(fechaAprobacion);
    const strfa = `${fa.getFullYear()}-${fa.getMonth() + 1}-${fa.getDate()}`;
    database.query(`UPDATE pedido_proveedor SET
    aprobado = 1,
    idfuncionario_aprobacion = ?,
    fecha_aprobacion = ? WHERE idpedido = ?`, [idfuncionarioAprobacion, strfa, idpedido], (err, result, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.post("/:idpedido/anulacion", (req, res) => {
    const { idpedido } = req.params;
    database.query("UPDATE pedido_proveedor SET anulado = true WHERE idpedido = ?", [idpedido], (err, result, fields) => {
        if (!err) {
            res.sendStatus(204);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

module.exports = router;