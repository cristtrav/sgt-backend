const mysql=require("mysql");

const mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "toor",
    password: "1qa2ws3ed",
    database: "sgt"
});

mysqlConnection.connect(function (err){
    if(err){
        console.log("Error al conectar a la base de datos");
        console.log(err);
    }else{
        console.log("Conectado a la base de datos.");
    }
});

module.exports = mysqlConnection;