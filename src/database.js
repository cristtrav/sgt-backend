const mysql = require("mysql");
const fs = require("fs");

const host = "localhost";
const user = "toor";
const password = "1qa2ws3ed";
const database = "sgt";

var data;

try {
    //leer SQL
    data = fs.readFileSync(__dirname + '/database.sql', 'utf8');
} catch (e) {
    console.log(e);
}

//Crear base de datos si no existe
const mysqlConnection = mysql.createConnection({ multipleStatements: true, host, user, password });
mysqlConnection.connect(function (err) {
        if (err) {
            console.log("Error al conectar e inicializar");
            console.log(err);
        } else {
            mysqlConnection.query(data, (err, rows, fields) => {
                if (!err) {
                    console.log("Base de datos inicializada");
                    //Luego de inicializar retornar la conexion para utilizar
                    mysqlConnection.query(`USE ${database}`, (error, rows, fields)=>{
                        if(!error){
                            console.log("Base de datos cambiada a SGT");
                        }else{
                            console.log("Error al cambiar a base de datos SGT");
                            console.log(error);
                        }
                    });                
                } else {
                    console.log(err);
                }
            });
        }
    });

module.exports = mysqlConnection;