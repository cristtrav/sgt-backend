const express = require("express");
const morgan = require("morgan");
const app = express();

//Settings
app.set("port", process.env.PORT || 3000);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

//Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes
app.use("/api/regiones", require("./routes/regiones"));
app.use("/api/departamentos", require("./routes/departamentos"));
app.use("/api/ciudades", require("./routes/ciudades"));
app.use("/api/clientes", require("./routes/clientes"));
app.use("/api/proveedores", require("./routes/proveedores"));
app.use("/api/marcas", require("./routes/marcas"));
app.use("/api/modelos", require("./routes/modelos"));
app.use("/api/cargos", require("./routes/cargos"));
app.use("/api/funcionarios", require("./routes/funcionarios"));

//Starting the server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
