const { Router } = require("express");
const router = Router();

const database = require("./../database");
const util = require("./../util");

router.get("/", (req, res)=>{
    database.query("SELECT * FROM cargo", (err, rows, fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
            res.status(500).send(util.mysqlMsgToHuman(err));
        }
    });
});

module.exports = router;