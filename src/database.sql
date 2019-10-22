-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema sgt
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema sgt
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `sgt` DEFAULT CHARACTER SET utf8 ;
USE `sgt` ;

-- -----------------------------------------------------
-- Table `sgt`.`region`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`region` (
  `idregion` INT NOT NULL,
  `nombre` VARCHAR(45) NULL,
  PRIMARY KEY (`idregion`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgt`.`departamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`departamento` (
  `iddepartamento` INT NOT NULL,
  `nombre` VARCHAR(45) NULL,
  `idregion` INT NOT NULL COMMENT 'Oriental, Occidental\n',
  PRIMARY KEY (`iddepartamento`),
  INDEX `fk_departamento_region1_idx` (`idregion` ASC),
  CONSTRAINT `fk_departamento_region1`
    FOREIGN KEY (`idregion`)
    REFERENCES `sgt`.`region` (`idregion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgt`.`ciudad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`ciudad` (
  `iddepartamento` INT NOT NULL,
  `idciudad` INT NOT NULL,
  `nombre` VARCHAR(45) NULL,
  PRIMARY KEY (`iddepartamento`, `idciudad`),
  INDEX `fk_ciudad_departamento1_idx` (`iddepartamento` ASC),
  CONSTRAINT `fk_ciudad_departamento1`
    FOREIGN KEY (`iddepartamento`)
    REFERENCES `sgt`.`departamento` (`iddepartamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgt`.`cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`cliente` (
  `ci` INT NOT NULL,
  `nombres` VARCHAR(50) NULL,
  `apellidos` VARCHAR(50) NULL,
  `telefono` VARCHAR(20) NULL,
  `dv_ruc` TINYINT NULL COMMENT 'Digito verificador de SET: 0-9',
  `fecha_registro` DATE NULL,
  `iddepartamento` INT NOT NULL,
  `idciudad` INT NOT NULL,
  PRIMARY KEY (`ci`, `iddepartamento`, `idciudad`),
  INDEX `fk_cliente_ciudad1_idx` (`iddepartamento` ASC, `idciudad` ASC),
  CONSTRAINT `fk_cliente_ciudad1`
    FOREIGN KEY (`iddepartamento` , `idciudad`)
    REFERENCES `sgt`.`ciudad` (`iddepartamento` , `idciudad`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Datos de los clientes\n';


-- -----------------------------------------------------
-- Table `sgt`.`cargo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`cargo` (
  `idcargo` INT NOT NULL,
  `nombre` VARCHAR(45) NULL,
  PRIMARY KEY (`idcargo`))
ENGINE = InnoDB
COMMENT = 'Cargo del funcionario. Ej: Mecanico, Mecanico Jefe, Cajero';


-- -----------------------------------------------------
-- Table `sgt`.`funcionario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`funcionario` (
  `idfuncionario` INT NOT NULL,
  `telefono` VARCHAR(45) NULL,
  `ci` VARCHAR(45) NULL,
  `idcargo` INT NOT NULL,
  `password` VARCHAR(150) NULL COMMENT 'Contraseña de acceso al sistema. Se debe encriptar usando SHA256 o similar',
  `nombres` VARCHAR(45) NOT NULL,
  `apellidos` VARCHAR(45) NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `acceso_sistema` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`idfuncionario`),
  INDEX `fk_funcionario_cargo_idx` (`idcargo` ASC),
  CONSTRAINT `fk_funcionario_cargo`
    FOREIGN KEY (`idcargo`)
    REFERENCES `sgt`.`cargo` (`idcargo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Funcionarios y usuarios del sistema';


-- -----------------------------------------------------
-- Table `sgt`.`servicio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`servicio` (
  `idservicio` INT NOT NULL,
  `nombre` VARCHAR(45) NULL,
  `precio` INT NULL,
  `porcentaje_iva` SMALLINT NULL,
  PRIMARY KEY (`idservicio`))
ENGINE = InnoDB
COMMENT = 'Servicios que ofrece la empresa\n';


-- -----------------------------------------------------
-- Table `sgt`.`marca`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`marca` (
  `idmarca` INT NOT NULL,
  `nombre` VARCHAR(30) NULL,
  PRIMARY KEY (`idmarca`))
ENGINE = InnoDB
COMMENT = 'Marca de los vehiculos';


-- -----------------------------------------------------
-- Table `sgt`.`modelo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`modelo` (
  `idmodelo` INT NOT NULL,
  `nombre` CHAR(20) NULL,
  `idmarca` INT NOT NULL,
  `anio` YEAR NULL,
  PRIMARY KEY (`idmodelo`),
  INDEX `fk_modelo_marca1_idx` (`idmarca` ASC),
  CONSTRAINT `fk_modelo_marca1`
    FOREIGN KEY (`idmarca`)
    REFERENCES `sgt`.`marca` (`idmarca`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgt`.`vehiculo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`vehiculo` (
  `idvehiculo` INT NOT NULL,
  `propietario` INT NOT NULL,
  `observacion` VARCHAR(200) NULL,
  `fecha_ingreso` DATE NULL,
  `modelo` INT NOT NULL,
  `chapa` VARCHAR(10) NULL,
  `color` VARCHAR(25) NULL,
  PRIMARY KEY (`idvehiculo`),
  INDEX `fk_vehiculo_cliente1_idx` (`propietario` ASC),
  INDEX `fk_vehiculo_modelo1_idx` (`modelo` ASC),
  CONSTRAINT `fk_vehiculo_cliente1`
    FOREIGN KEY (`propietario`)
    REFERENCES `sgt`.`cliente` (`ci`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_vehiculo_modelo1`
    FOREIGN KEY (`modelo`)
    REFERENCES `sgt`.`modelo` (`idmodelo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Datos de los vehiculos\n';


-- -----------------------------------------------------
-- Table `sgt`.`solicitud_servicio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`solicitud_servicio` (
  `idsolicitud_servicio` INT NOT NULL,
  `vehiculo` INT NOT NULL,
  `fecha_ingreso` DATE NULL,
  `fecha_salida` DATE NULL,
  `personal_asignado` INT NOT NULL,
  `fecha_hora_registro` DATETIME NULL,
  `funcionario_registro` INT NOT NULL,
  `completado` TINYINT(1) NULL,
  PRIMARY KEY (`idsolicitud_servicio`),
  INDEX `fk_historial_servicio_vehiculo1_idx` (`vehiculo` ASC),
  INDEX `fk_historial_servicio_funcionario1_idx` (`personal_asignado` ASC),
  INDEX `fk_solicitud_servicio_funcionario1_idx` (`funcionario_registro` ASC),
  CONSTRAINT `fk_historial_servicio_vehiculo1`
    FOREIGN KEY (`vehiculo`)
    REFERENCES `sgt`.`vehiculo` (`idvehiculo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_historial_servicio_funcionario1`
    FOREIGN KEY (`personal_asignado`)
    REFERENCES `sgt`.`funcionario` (`idfuncionario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitud_servicio_funcionario1`
    FOREIGN KEY (`funcionario_registro`)
    REFERENCES `sgt`.`funcionario` (`idfuncionario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Servicios tecnicos realizados a un determinado vehiculo';


-- -----------------------------------------------------
-- Table `sgt`.`solicitud_servicio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`solicitud_servicio` (
  `idsolicitud_servicio` INT NOT NULL,
  `vehiculo` INT NOT NULL,
  `fecha_ingreso` DATE NULL,
  `fecha_salida` DATE NULL,
  `personal_asignado` INT NOT NULL,
  `fecha_hora_registro` DATETIME NULL,
  `funcionario_registro` INT NOT NULL,
  `completado` TINYINT(1) NULL,
  PRIMARY KEY (`idsolicitud_servicio`),
  INDEX `fk_historial_servicio_vehiculo1_idx` (`vehiculo` ASC),
  INDEX `fk_historial_servicio_funcionario1_idx` (`personal_asignado` ASC),
  INDEX `fk_solicitud_servicio_funcionario1_idx` (`funcionario_registro` ASC),
  CONSTRAINT `fk_historial_servicio_vehiculo1`
    FOREIGN KEY (`vehiculo`)
    REFERENCES `sgt`.`vehiculo` (`idvehiculo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_historial_servicio_funcionario1`
    FOREIGN KEY (`personal_asignado`)
    REFERENCES `sgt`.`funcionario` (`idfuncionario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitud_servicio_funcionario1`
    FOREIGN KEY (`funcionario_registro`)
    REFERENCES `sgt`.`funcionario` (`idfuncionario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Servicios tecnicos realizados a un determinado vehiculo';


-- -----------------------------------------------------
-- Table `sgt`.`proveedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`proveedor` (
  `idproveedor` INT NOT NULL,
  `razonsocial` VARCHAR(80) NULL,
  `telefono` VARCHAR(25) NULL,
  `dv_ruc` TINYINT NULL,
  `email` VARCHAR(80) NULL,
  `documento` INT NULL,
  `contacto` VARCHAR(50) NULL,
  `telefono_contacto` VARCHAR(25) NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `fecha_ingreso` DATE NULL,
  PRIMARY KEY (`idproveedor`))
ENGINE = InnoDB
COMMENT = 'Proveedores de repuestos';


-- -----------------------------------------------------
-- Table `sgt`.`repuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`repuesto` (
  `idrepuesto` INT NOT NULL,
  `precio` INT NULL,
  `nombre` VARCHAR(45) NULL,
  `proveedor` INT NOT NULL,
  PRIMARY KEY (`idrepuesto`),
  INDEX `fk_repuesto_proveedor1_idx` (`proveedor` ASC),
  CONSTRAINT `fk_repuesto_proveedor1`
    FOREIGN KEY (`proveedor`)
    REFERENCES `sgt`.`proveedor` (`idproveedor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgt`.`detalle_servicios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`detalle_servicios` (
  `servicio` INT NOT NULL,
  `solicitud_servicio` INT NOT NULL,
  `observacion` VARCHAR(200) NULL,
  `precio` INT NULL,
  `completado` TINYINT(1) NULL,
  PRIMARY KEY (`servicio`, `solicitud_servicio`),
  INDEX `fk_servicio_has_historial_servicio_historial_servicio1_idx` (`solicitud_servicio` ASC),
  INDEX `fk_servicio_has_historial_servicio_servicio1_idx` (`servicio` ASC),
  CONSTRAINT `fk_servicio_has_historial_servicio_servicio1`
    FOREIGN KEY (`servicio`)
    REFERENCES `sgt`.`servicio` (`idservicio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_servicio_has_historial_servicio_historial_servicio1`
    FOREIGN KEY (`solicitud_servicio`)
    REFERENCES `sgt`.`solicitud_servicio` (`idsolicitud_servicio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Lista de servicios realizados en un servicio tecnico';


-- -----------------------------------------------------
-- Table `sgt`.`detalle_servicios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`detalle_servicios` (
  `servicio` INT NOT NULL,
  `solicitud_servicio` INT NOT NULL,
  `observacion` VARCHAR(200) NULL,
  `precio` INT NULL,
  `completado` TINYINT(1) NULL,
  PRIMARY KEY (`servicio`, `solicitud_servicio`),
  INDEX `fk_servicio_has_historial_servicio_historial_servicio1_idx` (`solicitud_servicio` ASC),
  INDEX `fk_servicio_has_historial_servicio_servicio1_idx` (`servicio` ASC),
  CONSTRAINT `fk_servicio_has_historial_servicio_servicio1`
    FOREIGN KEY (`servicio`)
    REFERENCES `sgt`.`servicio` (`idservicio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_servicio_has_historial_servicio_historial_servicio1`
    FOREIGN KEY (`solicitud_servicio`)
    REFERENCES `sgt`.`solicitud_servicio` (`idsolicitud_servicio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Lista de servicios realizados en un servicio tecnico';


-- -----------------------------------------------------
-- Table `sgt`.`repuesto_utilizado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`repuesto_utilizado` (
  `repuesto` INT NOT NULL,
  `historial_servicio` INT NOT NULL,
  PRIMARY KEY (`repuesto`, `historial_servicio`),
  INDEX `fk_repuesto_has_historial_servicio_historial_servicio1_idx` (`historial_servicio` ASC),
  INDEX `fk_repuesto_has_historial_servicio_repuesto1_idx` (`repuesto` ASC),
  CONSTRAINT `fk_repuesto_has_historial_servicio_repuesto1`
    FOREIGN KEY (`repuesto`)
    REFERENCES `sgt`.`repuesto` (`idrepuesto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_repuesto_has_historial_servicio_historial_servicio1`
    FOREIGN KEY (`historial_servicio`)
    REFERENCES `sgt`.`solicitud_servicio` (`idsolicitud_servicio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Repuestos utilizados en un determinado servicio tecnico';


-- -----------------------------------------------------
-- Table `sgt`.`talonario_factura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`talonario_factura` (
  `idtalonario_factura` INT NOT NULL,
  `cod_establecimiento` VARCHAR(10) NULL,
  `nro_inicio` INT NULL,
  `nro_fin` INT NULL,
  `fecha_inicio_vigencia` DATE NULL,
  `fecha_fin_vigencia` DATE NULL,
  `nro_actual` INT NULL COMMENT 'El numero que sera usado al generar la cuota. Se autoincrementa en cada factura',
  `timbrado` INT NULL COMMENT 'Timbrado de tributacion',
  PRIMARY KEY (`idtalonario_factura`))
ENGINE = InnoDB
COMMENT = 'Talonario de factura legal con datos proporcionados por tributacion. Preimpreso.';


-- -----------------------------------------------------
-- Table `sgt`.`factura_venta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`factura_venta` (
  `idfactura_venta` INT NOT NULL,
  `fecha` DATE NULL,
  `nro_factura` VARCHAR(45) NULL,
  `total` INT NULL,
  `total_iva10` VARCHAR(45) NULL,
  `total_iva5` VARCHAR(45) NULL,
  `cliente` INT NOT NULL,
  `talonario_factura` INT NOT NULL COMMENT 'A que talonario impreso pertenece. Factura preimpresa',
  `anulado` TINYINT(1) NULL,
  `fecha_hora_registro` DATETIME NULL,
  `fecha_hora_anulacion` DATETIME NULL,
  PRIMARY KEY (`idfactura_venta`),
  INDEX `fk_factura_venta_cliente1_idx` (`cliente` ASC),
  INDEX `fk_factura_venta_talonario_factura1_idx` (`talonario_factura` ASC),
  CONSTRAINT `fk_factura_venta_cliente1`
    FOREIGN KEY (`cliente`)
    REFERENCES `sgt`.`cliente` (`ci`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_factura_venta_talonario_factura1`
    FOREIGN KEY (`talonario_factura`)
    REFERENCES `sgt`.`talonario_factura` (`idtalonario_factura`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Cabecera de factura de venta\n';


-- -----------------------------------------------------
-- Table `sgt`.`detalle_factura_venta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`detalle_factura_venta` (
  `iddetalle_factura_venta` INT NOT NULL,
  `item` VARCHAR(100) NULL COMMENT 'Descripcion del item a cobrar. Servicio o producto\n',
  `cantidad` INT NULL,
  `monto` INT NULL,
  `subtotal` INT NULL,
  `factura_venta` INT NOT NULL,
  `porcentaje_iva` TINYINT NULL COMMENT '0, 5 ó 10\n',
  PRIMARY KEY (`iddetalle_factura_venta`),
  INDEX `fk_detalle_factura_venta_factura_venta1_idx` (`factura_venta` ASC),
  CONSTRAINT `fk_detalle_factura_venta_factura_venta1`
    FOREIGN KEY (`factura_venta`)
    REFERENCES `sgt`.`factura_venta` (`idfactura_venta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Items de la factura de venta';


-- -----------------------------------------------------
-- Table `sgt`.`caja`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`caja` (
  `idcaja` INT NOT NULL,
  `nombre` VARCHAR(45) NULL,
  `abierto` TINYINT(1) NULL,
  PRIMARY KEY (`idcaja`))
ENGINE = InnoDB
COMMENT = 'Registra las cajas disponibles\n';


-- -----------------------------------------------------
-- Table `sgt`.`movimiento_caja`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`movimiento_caja` (
  `idmovimiento_caja` INT NOT NULL,
  `fecha_hora_apertura` DATETIME NULL,
  `fecha_hora_cierre` DATETIME NULL,
  `monto_apertura` INT NULL,
  `monto_cierre` INT NULL,
  `monto_cierre_esperado` INT NULL,
  `caja` INT NOT NULL,
  `funcionario` INT NOT NULL,
  PRIMARY KEY (`idmovimiento_caja`),
  INDEX `fk_movimiento_caja_caja1_idx` (`caja` ASC),
  INDEX `fk_movimiento_caja_funcionario1_idx` (`funcionario` ASC),
  CONSTRAINT `fk_movimiento_caja_caja1`
    FOREIGN KEY (`caja`)
    REFERENCES `sgt`.`caja` (`idcaja`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_movimiento_caja_funcionario1`
    FOREIGN KEY (`funcionario`)
    REFERENCES `sgt`.`funcionario` (`idfuncionario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Registra eventos de apertura y cierre de caja\n';


-- -----------------------------------------------------
-- Table `sgt`.`concepto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`concepto` (
  `idconcepto` INT NOT NULL,
  `nombre` VARCHAR(45) NULL,
  PRIMARY KEY (`idconcepto`))
ENGINE = InnoDB
COMMENT = 'Concepto de movimiento de caja.\n';


-- -----------------------------------------------------
-- Table `sgt`.`detalle_movimiento_caja`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`detalle_movimiento_caja` (
  `iddetalle_movimiento_aja` INT NOT NULL,
  `monto` INT NULL,
  `entrada` TINYINT(1) NULL COMMENT '1=Entrada de dinero. 0=Salida de dinero',
  `concepto` INT NOT NULL,
  `movimiento_caja` INT NOT NULL,
  `observacion` VARCHAR(250) NULL,
  PRIMARY KEY (`iddetalle_movimiento_aja`),
  INDEX `fk_detalle_movimiento_caja_concepto1_idx` (`concepto` ASC),
  INDEX `fk_detalle_movimiento_caja_movimiento_caja1_idx` (`movimiento_caja` ASC),
  CONSTRAINT `fk_detalle_movimiento_caja_concepto1`
    FOREIGN KEY (`concepto`)
    REFERENCES `sgt`.`concepto` (`idconcepto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_detalle_movimiento_caja_movimiento_caja1`
    FOREIGN KEY (`movimiento_caja`)
    REFERENCES `sgt`.`movimiento_caja` (`idmovimiento_caja`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Movimientos de caja. Entrada o salida de dinero\n';


-- -----------------------------------------------------
-- Table `sgt`.`factura_compra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`factura_compra` (
  `idfactura_compra` INT NOT NULL,
  `fecha` DATE NULL,
  `nro_factura` VARCHAR(45) NULL,
  `proveedor` INT NOT NULL,
  `contado` TINYINT(1) NULL,
  `total` INT NULL,
  `total_iva10` INT NULL,
  `total_iva5` INT NULL,
  PRIMARY KEY (`idfactura_compra`),
  INDEX `fk_factura_compra_proveedor1_idx` (`proveedor` ASC),
  CONSTRAINT `fk_factura_compra_proveedor1`
    FOREIGN KEY (`proveedor`)
    REFERENCES `sgt`.`proveedor` (`idproveedor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Cabecera de factura de compra';


-- -----------------------------------------------------
-- Table `sgt`.`detalle_factura_compra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`detalle_factura_compra` (
  `iddetalle_factura_compra` INT NOT NULL,
  `cantidad` INT NULL,
  `precio` INT NULL,
  `porcentaje_iva` TINYINT NULL COMMENT '0, 5 ó 10',
  `repuesto` INT NOT NULL,
  `sub_total` INT NULL,
  PRIMARY KEY (`iddetalle_factura_compra`),
  INDEX `fk_detalle_factura_compra_repuesto1_idx` (`repuesto` ASC),
  CONSTRAINT `fk_detalle_factura_compra_repuesto1`
    FOREIGN KEY (`repuesto`)
    REFERENCES `sgt`.`repuesto` (`idrepuesto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgt`.`modulo_sistema`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`modulo_sistema` (
  `idmodulo_sistema` INT NOT NULL,
  `nombre` VARCHAR(45) NULL,
  PRIMARY KEY (`idmodulo_sistema`))
ENGINE = InnoDB
COMMENT = 'Modulos con que cuenta el sistema. Solo sirve para organizar las funcionalidades';


-- -----------------------------------------------------
-- Table `sgt`.`funcionalidad_modulo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`funcionalidad_modulo` (
  `idfuncionalidad_modulo` INT NOT NULL,
  `descripcion` VARCHAR(45) NULL,
  `modulo_sistema` INT NOT NULL COMMENT 'A que modulo pertenece la funcionalidad',
  PRIMARY KEY (`idfuncionalidad_modulo`),
  INDEX `fk_funcionalidad_modulo_modulo_sistema1_idx` (`modulo_sistema` ASC),
  CONSTRAINT `fk_funcionalidad_modulo_modulo_sistema1`
    FOREIGN KEY (`modulo_sistema`)
    REFERENCES `sgt`.`modulo_sistema` (`idmodulo_sistema`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Describe las funcionalidades del sistema\n';


-- -----------------------------------------------------
-- Table `sgt`.`permiso_funcionario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`permiso_funcionario` (
  `funcionario` INT NOT NULL,
  `funcionalidad_modulo` INT NOT NULL,
  PRIMARY KEY (`funcionario`, `funcionalidad_modulo`),
  INDEX `fk_funcionario_has_funcionalidad_modulo_funcionalidad_modul_idx` (`funcionalidad_modulo` ASC),
  INDEX `fk_funcionario_has_funcionalidad_modulo_funcionario1_idx` (`funcionario` ASC),
  CONSTRAINT `fk_funcionario_has_funcionalidad_modulo_funcionario1`
    FOREIGN KEY (`funcionario`)
    REFERENCES `sgt`.`funcionario` (`idfuncionario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_funcionario_has_funcionalidad_modulo_funcionalidad_modulo1`
    FOREIGN KEY (`funcionalidad_modulo`)
    REFERENCES `sgt`.`funcionalidad_modulo` (`idfuncionalidad_modulo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Las funcionalidades del sistema que tiene disponible un funcionario.';


-- -----------------------------------------------------
-- Table `sgt`.`historial`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`historial` (
  `idhistorial` INT NOT NULL,
  `fecha_hora_evento` DATETIME NULL,
  `descripcion` TEXT NULL COMMENT 'Descripcion del evento ocurrido. Operación (Registro, modificacon, eliminacion). Tabla. Y referencia a los datos anteriores\n',
  `funcionario` INT NOT NULL,
  `modulo_sistema` INT NOT NULL,
  PRIMARY KEY (`idhistorial`),
  INDEX `fk_historial_funcionario1_idx` (`funcionario` ASC),
  INDEX `fk_historial_modulo_sistema1_idx` (`modulo_sistema` ASC),
  CONSTRAINT `fk_historial_funcionario1`
    FOREIGN KEY (`funcionario`)
    REFERENCES `sgt`.`funcionario` (`idfuncionario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_historial_modulo_sistema1`
    FOREIGN KEY (`modulo_sistema`)
    REFERENCES `sgt`.`modulo_sistema` (`idmodulo_sistema`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Registra los eventos del sistema. Registrados por funcionario y por modulo. Ej: Modificacion o eliminacion de registros';

USE `sgt` ;

-- -----------------------------------------------------
-- Placeholder table for view `sgt`.`vw_ciudades_departamentos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`vw_ciudades_departamentos` (`idciudad` INT, `nombre` INT, `iddepartamento` INT, `departamento` INT);

-- -----------------------------------------------------
-- Placeholder table for view `sgt`.`vw_clientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`vw_clientes` (`ci` INT, `nombres` INT, `apellidos` INT, `telefono` INT, `dvRuc` INT, `fechaRegistro` INT, `idciudad` INT, `iddepartamento` INT, `ciudad` INT, `departamento` INT, `fechaIngreso` INT);

-- -----------------------------------------------------
-- Placeholder table for view `sgt`.`vw_departamentos_regiones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`vw_departamentos_regiones` (`iddepartamento` INT, `nombre` INT, `idregion` INT, `region` INT);

-- -----------------------------------------------------
-- Placeholder table for view `sgt`.`vw_funcionarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`vw_funcionarios` (`idfuncionario` INT, `nombres` INT, `apellidos` INT, `telefono` INT, `ci` INT, `activo` INT, `accesoSistema` INT, `idcargo` INT, `cargo` INT);

-- -----------------------------------------------------
-- Placeholder table for view `sgt`.`vw_modelos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`vw_modelos` (`idmodelo` INT, `nombre` INT, `idmarca` INT, `marca` INT, `anio` INT);

-- -----------------------------------------------------
-- Placeholder table for view `sgt`.`vw_proveedores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`vw_proveedores` (`idproveedor` INT, `razonsocial` INT, `telefono` INT, `dvRuc` INT, `documento` INT, `contacto` INT, `telefonoContacto` INT, `activo` INT, `fechaIngreso` INT, `email` INT);

-- -----------------------------------------------------
-- Placeholder table for view `sgt`.`vw_vehiculos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sgt`.`vw_vehiculos` (`idvehiculo` INT, `cipropietario` INT, `nombresPropietario` INT, `apellidosPropietario` INT, `idmodelo` INT, `modelo` INT, `anioModelo` INT, `idmarca` INT, `marca` INT, `fechaIngreso` INT, `chapa` INT, `color` INT, `observacion` INT);

-- -----------------------------------------------------
-- View `sgt`.`vw_ciudades_departamentos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgt`.`vw_ciudades_departamentos`;
USE `sgt`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`toor`@`localhost` SQL SECURITY DEFINER VIEW `sgt`.`vw_ciudades_departamentos` AS select `sgt`.`ciudad`.`idciudad` AS `idciudad`,`sgt`.`ciudad`.`nombre` AS `nombre`,`sgt`.`departamento`.`iddepartamento` AS `iddepartamento`,`sgt`.`departamento`.`nombre` AS `departamento` from (`sgt`.`ciudad` join `sgt`.`departamento` on((`sgt`.`departamento`.`iddepartamento` = `sgt`.`ciudad`.`iddepartamento`)));

-- -----------------------------------------------------
-- View `sgt`.`vw_clientes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgt`.`vw_clientes`;
USE `sgt`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`toor`@`localhost` SQL SECURITY DEFINER VIEW `sgt`.`vw_clientes` AS select `sgt`.`cliente`.`ci` AS `ci`,`sgt`.`cliente`.`nombres` AS `nombres`,`sgt`.`cliente`.`apellidos` AS `apellidos`,`sgt`.`cliente`.`telefono` AS `telefono`,`sgt`.`cliente`.`dv_ruc` AS `dvRuc`,`sgt`.`cliente`.`fecha_registro` AS `fechaRegistro`,`sgt`.`cliente`.`idciudad` AS `idciudad`,`sgt`.`cliente`.`iddepartamento` AS `iddepartamento`,`sgt`.`ciudad`.`nombre` AS `ciudad`,`sgt`.`departamento`.`nombre` AS `departamento`,`sgt`.`cliente`.`fecha_registro` AS `fechaIngreso` from ((`sgt`.`cliente` join `sgt`.`ciudad` on(((`sgt`.`ciudad`.`idciudad` = `sgt`.`cliente`.`idciudad`) and (`sgt`.`ciudad`.`iddepartamento` = `sgt`.`cliente`.`iddepartamento`)))) join `sgt`.`departamento` on((`sgt`.`departamento`.`iddepartamento` = `sgt`.`cliente`.`iddepartamento`)));

-- -----------------------------------------------------
-- View `sgt`.`vw_departamentos_regiones`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgt`.`vw_departamentos_regiones`;
USE `sgt`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`toor`@`localhost` SQL SECURITY DEFINER VIEW `sgt`.`vw_departamentos_regiones` AS select `sgt`.`departamento`.`iddepartamento` AS `iddepartamento`,`sgt`.`departamento`.`nombre` AS `nombre`,`sgt`.`departamento`.`idregion` AS `idregion`,`sgt`.`region`.`nombre` AS `region` from (`sgt`.`departamento` join `sgt`.`region` on((`sgt`.`departamento`.`idregion` = `sgt`.`region`.`idregion`)));

-- -----------------------------------------------------
-- View `sgt`.`vw_funcionarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgt`.`vw_funcionarios`;
USE `sgt`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`toor`@`localhost` SQL SECURITY DEFINER VIEW `sgt`.`vw_funcionarios` AS select `sgt`.`funcionario`.`idfuncionario` AS `idfuncionario`,`sgt`.`funcionario`.`nombres` AS `nombres`,`sgt`.`funcionario`.`apellidos` AS `apellidos`,`sgt`.`funcionario`.`telefono` AS `telefono`,`sgt`.`funcionario`.`ci` AS `ci`,`sgt`.`funcionario`.`activo` AS `activo`,`sgt`.`funcionario`.`acceso_sistema` AS `accesoSistema`,`sgt`.`funcionario`.`idcargo` AS `idcargo`,`sgt`.`cargo`.`nombre` AS `cargo` from (`sgt`.`funcionario` join `sgt`.`cargo` on((`sgt`.`funcionario`.`idcargo` = `sgt`.`cargo`.`idcargo`)));

-- -----------------------------------------------------
-- View `sgt`.`vw_modelos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgt`.`vw_modelos`;
USE `sgt`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`toor`@`localhost` SQL SECURITY DEFINER VIEW `sgt`.`vw_modelos` AS select `sgt`.`modelo`.`idmodelo` AS `idmodelo`,`sgt`.`modelo`.`nombre` AS `nombre`,`sgt`.`modelo`.`idmarca` AS `idmarca`,`sgt`.`marca`.`nombre` AS `marca`,`sgt`.`modelo`.`anio` AS `anio` from (`sgt`.`modelo` join `sgt`.`marca` on((`sgt`.`marca`.`idmarca` = `sgt`.`modelo`.`idmarca`)));

-- -----------------------------------------------------
-- View `sgt`.`vw_proveedores`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgt`.`vw_proveedores`;
USE `sgt`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`toor`@`localhost` SQL SECURITY DEFINER VIEW `sgt`.`vw_proveedores` AS select `sgt`.`proveedor`.`idproveedor` AS `idproveedor`,`sgt`.`proveedor`.`razonsocial` AS `razonsocial`,`sgt`.`proveedor`.`telefono` AS `telefono`,`sgt`.`proveedor`.`dv_ruc` AS `dvRuc`,`sgt`.`proveedor`.`documento` AS `documento`,`sgt`.`proveedor`.`contacto` AS `contacto`,`sgt`.`proveedor`.`telefono_contacto` AS `telefonoContacto`,`sgt`.`proveedor`.`activo` AS `activo`,`sgt`.`proveedor`.`fecha_ingreso` AS `fechaIngreso`,`sgt`.`proveedor`.`email` AS `email` from `sgt`.`proveedor`;

-- -----------------------------------------------------
-- View `sgt`.`vw_vehiculos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgt`.`vw_vehiculos`;
USE `sgt`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`toor`@`localhost` SQL SECURITY DEFINER VIEW `sgt`.`vw_vehiculos` AS select `sgt`.`vehiculo`.`idvehiculo` AS `idvehiculo`,`sgt`.`vehiculo`.`propietario` AS `cipropietario`,`sgt`.`cliente`.`nombres` AS `nombresPropietario`,`sgt`.`cliente`.`apellidos` AS `apellidosPropietario`,`sgt`.`vehiculo`.`modelo` AS `idmodelo`,`sgt`.`modelo`.`nombre` AS `modelo`,`sgt`.`modelo`.`anio` AS `anioModelo`,`sgt`.`marca`.`idmarca` AS `idmarca`,`sgt`.`marca`.`nombre` AS `marca`,`sgt`.`vehiculo`.`fecha_ingreso` AS `fechaIngreso`,`sgt`.`vehiculo`.`chapa` AS `chapa`,`sgt`.`vehiculo`.`color` AS `color`,`sgt`.`vehiculo`.`observacion` AS `observacion` from (((`sgt`.`vehiculo` join `sgt`.`cliente` on((`sgt`.`vehiculo`.`propietario` = `sgt`.`cliente`.`ci`))) join `sgt`.`modelo` on((`sgt`.`vehiculo`.`modelo` = `sgt`.`modelo`.`idmodelo`))) join `sgt`.`marca` on((`sgt`.`modelo`.`idmarca` = `sgt`.`marca`.`idmarca`)));

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
