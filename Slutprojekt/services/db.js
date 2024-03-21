const mysql = require("mysql2/promise") // "mysql2/promise" gör att vi kan använda async/await istället för callbacks.

// Här skapas ett databaskopplings-objekt med inställningar för att ansluta till servern och databasen.
async function getConnection() {
  return mysql.createConnection({
    host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'newtest'
  })
}



// Detta exporterar delar av modulen så att andra filer kan komma åt dem med require.
module.exports = {
  getUsers,
}