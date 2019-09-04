const mysql = require("mysql");
const fs = require("fs");

const host = "localhost";
const user = "toor";
const password = "1qa2ws3ed";
const database = "sgt";

let mysqlConnection;

try {
    //Crear base de datos si no existe
    let data = fs.readFileSync(__dirname + '/database.sql', 'utf8');
    const mysqlConIni = mysql.createConnection({ multipleStatements: true, host, user, password });
    mysqlConIni.connect(function (err) {
        if (err) {
            console.log("Error al conectar e inicializar");
            console.log(err);
        } else {
            mysqlConIni.query(data, (err, rows, fields) => {
                if (!err) {
                    console.log("Base de datos inicializada");
                    
                    //Luego de inicializar retornar la conexion para utilizar
                    mysqlConnection = mysql.createConnection({ host, user, password, database });
                    mysqlConnection.connect(function (err) {
                        if (err) {
                            console.log("Error al conectar a la base de datos");
                            console.log(err);
                        } else {
                            console.log("Conectado a la base de datos.");
                        }
                    });
                } else {
                    console.log(err);
                }
            });
        }
    });
} catch (e) {
    console.log(e);
}

module.exports = { mysqlConnection };