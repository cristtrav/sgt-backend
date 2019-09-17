# SGT Backend
Software del lado servidor del Proyecto de tesis SGT (Sistema de Gestión de Talleres) de la UNVES.
Proporciona una API siguiendo los principios REST e utilizando JSON como portador de datos.

## Requisitos
Instalado y configurado el servidor de base de datos [MySQL](https://www.mysql.com)
Instalado y configurado [Node](https://nodejs.org).

## Configurar la conexión
Los parámetros de conexión con la base de datos se encuentran en el archivo `src/database.js`. Cambiar el `user` y `password` de acuerdo al servidor MySQL instalado.

## Ejecutar el servidor
Se debe ejecutar el archivo `index.js` situado en la carpeta `src` con el comando `node` en la línea de comandos.
Ejemplo: 
`node src/index.js`

## Observaciones
El servidor corre sobre el puerto `3000`.
