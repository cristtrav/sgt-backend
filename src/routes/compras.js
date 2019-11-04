const { Router } = require("express");
const router = Router();

const database = require("./../database");
const util = require("./../util");

router.post("/", async (req, res) => {
    console.log(req.body);
    const { fecha, nroFactura, idproveedor, idpedido, contado, detalle, total, totalIva5, totalIva10 } = req.body;
    const f = new Date(fecha);
    const strfp = `${f.getFullYear()}-${f.getMonth() + 1}-${f.getDate()}`;
    let pagado = 1;
    if (contado == 0) {
        pagado = 0;
    }
    database.beginTransaction((e) => {
        if (e) {
            console.log(e);
            res.status(500).send(util.mysqlMsgToHuman(e));
        } else {
            database.query(`INSERT INTO factura_compra(fecha, nro_factura, idproveedor, contado, pagado, idpedido, total, total_iva5, total_iva10)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [f, nroFactura, idproveedor, contado, pagado, idpedido, total, totalIva5, totalIva10], (err, result, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(util.mysqlMsgToHuman(err));
                    database.rollback();
                } else {
                    const idcompra = result.insertId;
                    let sql = "";
                    let sqlStock = ""
                    let sqlPedido = "";
                    for (const dc of detalle) {
                        sql += `INSERT INTO detalle_factura_compra(idfactura_compra, idrepuesto, cantidad, precio, sub_total, porcentaje_iva)VALUES
                        (${database.escape(idcompra)},${database.escape(dc.idrepuesto)},${database.escape(dc.cantidad)},${database.escape(dc.precio)},${database.escape(dc.subtotal)},${database.escape(dc.porcentajeIva)});`;
                        sqlStock += `UPDATE repuesto SET stock = stock + ${database.escape(dc.cantidad)} WHERE idrepuesto = ${database.escape(dc.idrepuesto)};`;
                        if (idpedido != null) {
                            sqlPedido += `UPDATE detalle_pedido_proveedor SET cantidad_recibida = cantidad_recibida + ${database.escape(dc.cantidad)} WHERE idrepuesto = ${database.escape(dc.idrepuesto)};`
                        }
                    }
                    database.query(sql, (err, result, fields) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send(util.mysqlMsgToHuman(err));
                            database.rollback();
                        } else {
                            database.query(sqlStock, (err, result, fields) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send(util.mysqlMsgToHuman(err));
                                    database.rollback();
                                } else {
                                    if (idpedido != null) {
                                        database.query(sqlPedido, (err, result, fields) => {
                                            if (err) {
                                                console.log(err);
                                                res.status(500).send(util.mysqlMsgToHuman(err));
                                                database.rollback();
                                            } else {
                                                database.query(`SELECT (SUM(cantidad) - SUM(cantidad_recibida)) AS diferencia FROM sgt.detalle_pedido_proveedor WHERE idpedido = ${database.escape(idpedido)}`, (err, result, fields) => {
                                                    if (err) {
                                                        console.log(err);
                                                        res.status(500).send(util.mysqlMsgToHuman(err));
                                                        database.rollback();
                                                    } else {
                                                        let recibido = 0;
                                                        if (result[0].diferencia <= 0) {
                                                            recibido = 1;
                                                        }
                                                        database.query("UPDATE pedido_proveedor SET recibido = ?, fecha_recepcion = now() WHERE idpedido = ?", [recibido, idpedido], (err, result, fields) => {
                                                            if (err) {
                                                                console.log(err);
                                                                res.status(500).send(util.mysqlMsgToHuman(err));
                                                                database.rollback();
                                                            } else {
                                                                database.commit((e) => {
                                                                    if (e) {
                                                                        console.log(e);
                                                                        res.status(500).send(util.mysqlMsgToHuman(e));
                                                                        database.rollback();
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
                                    } else {
                                        database.commit((e) => {
                                            if (e) {
                                                console.log(e);
                                                res.status(500).send(util.mysqlMsgToHuman(e));
                                                database.rollback();
                                            } else {
                                                res.sendStatus(204);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });

                }
            });
        }
    });
});

router.get("/", (req, res) => {
    const { anulado } = req.query;
    let sql = `SELECT * FROM vw_compras`;
    if(anulado != null){
        sql = `SELECT * FROM vw_compras WHERE anulado = ${anulado}`;
    }
    database.query(sql, (err, result, field) => {
        if (!err) {
            res.json(result);
        } else {
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.post("/anulacion", (req, res) => {
    const { idcompra, idpedido } = req.body;
    database.beginTransaction((e) => {
        if (e) {
            console.log(e);
            res.status(500).send(util.mysqlMsgToHuman(e));
        } else {
            database.query("UPDATE factura_compra SET anulado = 1 WHERE idfactura_compra = ?", [idcompra], (err, result, fields) => {
                if (!err) {
                    database.query("SELECT * FROM detalle_factura_compra WHERE idfactura_compra = ?", [idcompra], (err, result, field) => {
                        if (!err) {
                            sqlStock = "";
                            sqlPedido = "";
                            for (const dc of result) {
                                sqlStock += `UPDATE repuesto SET stock = (stock - ${dc.cantidad}) WHERE idrepuesto = ${dc.idrepuesto};`;
                                sqlPedido += `UPDATE detalle_pedido_proveedor SET cantidad_recibida = cantidad_recibida - ${dc.cantidad} WHERE idrepuesto = ${dc.idrepuesto};`;
                            }
                            database.query(sqlStock, (err, result, fields) => {
                                if (!err) {
                                    if (idpedido != null) {
                                        database.query(sqlPedido, (err, result, fields) => {
                                            if (!err) {
                                                database.query(`SELECT (SUM(cantidad) - SUM(cantidad_recibida)) AS diferencia FROM sgt.detalle_pedido_proveedor WHERE idpedido = ${idpedido}`, (err, result, fields) => {
                                                    if (err) {
                                                        console.log(err);
                                                        res.status(500).send(util.mysqlMsgToHuman(err));
                                                        database.rollback();
                                                    } else {
                                                        let recibido = 0;
                                                        if (result[0].diferencia <= 0) {
                                                            recibido = 1;
                                                        }
                                                        database.query("UPDATE pedido_proveedor SET recibido = ?, fecha_recepcion = now() WHERE idpedido = ?", [recibido, idpedido], (err, result, fields) => {
                                                            if (err) {
                                                                console.log(err);
                                                                res.status(500).send(util.mysqlMsgToHuman(err));
                                                                database.rollback();
                                                            } else {
                                                                database.commit((e) => {
                                                                    if (e) {
                                                                        console.log(e);
                                                                        res.status(500).send(util.mysqlMsgToHuman(e));
                                                                        database.rollback();
                                                                    } else {
                                                                        res.sendStatus(204);
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            } else {
                                                console.log(err);
                                                database.rollback();
                                                res.status(500).status(util.mysqlMsgToHuman(err));
                                            }
                                        });
                                    } else {
                                        database.commit((error) => {
                                            if (!error) {
                                                res.sendStatus(204);
                                            } else {
                                                console.log();
                                                res.status(500).send(util.mysqlMsgToHuman(error));
                                                database.rollback();
                                            }
                                        });
                                    }
                                } else {
                                    console.log(err);
                                    res.status(500).send(util.mysqlMsgToHuman(err));
                                    database.rollback();
                                }
                            });
                        } else {
                            console.log(err);
                            res.status(500).send(util.mysqlMsgToHuman(err));
                            database.rollback();
                        }
                    });
                } else {
                    console.log(err);
                    res.status(500).send(util.mysqlMsgToHuman(err));
                    database.rollback();
                    
                }
            });
        }
    });
});

module.exports = router;