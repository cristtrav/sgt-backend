exports.mysqlMsgToHuman = function (sqlError) {
    switch (sqlError.errno) {
        case 1451:
            return "El registro está en uso."
            break;
        case 1062:
            return "El código ya existe."
            break;
        default:
            return sqlError.sqlMessage;
    }
};