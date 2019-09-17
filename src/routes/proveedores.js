const { Router } = require("express");
const router = Router();

const database = require("./../database");
const util = require("./../util");

router.get("/", (req, res)=>{
    database.query("SELECT * FROM vw_proveedores", (err, rows, fields)=>{
        if(!err){
            res.json(rows);
        }else{
            res.status(500).send(util.mysqlMsgToHuman(err));
            console.log(err);
        }
    });
});

router.post("/", (req, res)=>{
    console.log(req.body);
    const {idproveedor, razonsocial, documento, dvRuc, telefono, contacto, activo, fechaIngreso, telefonoContacto, email} = req.body;
    const fi = new Date(fechaIngreso);
    const strFi = `${fi.getFullYear()}-${fi.getMonth() + 1}-${fi.getDate()}`;
    database.query(`INSERT INTO proveedor(idproveedor, razonsocial, documento, dv_ruc, telefono, contacto, fecha_ingreso, activo, telefono_contacto, email)
     VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [idproveedor, razonsocial, documento, dvRuc, telefono, contacto, strFi, activo, telefonoContacto, email],
     (err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

router.put("/:idproveedor", (req, res)=>{
    console.log(req.body);
    const {idproveedor} = req.params;
    const {razonsocial, documento, dvRuc, telefono, contacto, activo, fechaIngreso, telefonoContacto, email} = req.body;
    const fi = new Date(fechaIngreso);
    const strFi = `${fi.getFullYear()}-${fi.getMonth() + 1}-${fi.getDate()}`;
    database.query(`UPDATE proveedor SET razonsocial = ?, documento = ?, dv_ruc = ?, telefono = ?,
     contacto = ?, fecha_ingreso = ?, activo = ?, telefono_contacto = ?, email = ? 
     WHERE idproveedor = ?`, [razonsocial, documento, dvRuc, telefono, contacto, strFi, activo, telefonoContacto, email, idproveedor], 
     (err, rows, fields)=>{
         if(!err){
             res.sendStatus(204);
         }else{
             console.log(err);
             res.status(500).send(util.mysqlMsgToHuman(err));
         }
     });
});

router.delete("/:idproveedor", (req, res)=>{
    const {idproveedor} = req.params;
    database.query(`DELETE FROM proveedor WHERE idproveedor = ?`,[idproveedor],(err, rows, fields)=>{
        if(!err){
            res.sendStatus(204);
        }else{
            console.log(err);
            res.status(500).status(util.mysqlMsgToHuman(err));
        }
    });
});

module.exports = router;