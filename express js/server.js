// const express = require('express')
// const app = express()
// const port = 3001

// app.get('/greet', (req, res) => {
//   res.send('Hej!');
// });

// // Routen för GET /greet med query parameter name
// app.get('/greet', (req, res) => {
//   const name = req.query.name || 'Okänd';
//   res.send(`Hej ${name}!`);
// });

// // Routen för GET /greet som returnerar en HTML-sida
// app.get('/greet-html', (req, res) => {
//   const name = req.query.name || 'Okänd';
//   const htmlResponse = `<html><head></head><body><h1>Hej ${name}!</h1></body></html>`;
//   res.send(htmlResponse);
// });


// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
const db = require("./services/db")
const express = require('express')
const app = express()
const port = 3001



// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root', 
//   password: '', 
//   database: 'newtest' 
// })

// db.connect((err) => {
//   if (err) throw err
//   console.log('Connected to database')
// })

app.get('/users', async (req, res) => {
  const users = await db.getUsers()
    const htmlResponse = `
      <html>
        <head></head>
        <body>
          <table>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
            ${users.map(user => `
              <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `
    res.send(htmlResponse)
  })

  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})