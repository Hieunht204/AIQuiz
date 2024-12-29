const sql = require("msnodesqlv8");

const serverName = "DESKTOP-7ODD7CH";
const connectionString = `server=${serverName};Database=QUIZ;Trusted_Connection=Yes;Driver={ODBC Driver 18 for SQL Server};Encrypt=yes;TrustServerCertificate=Yes`;


module.exports = {
    connectionString,
    sql,
}

