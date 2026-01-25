let http = require('http');

let mysql = require('mysql2');

let express = require('express');
let app = express();
let port = 8080;

const cors = require('cors');
app.use(cors()); 

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123pwd",
  database: "wmdb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mysql");
});

app.get('/users', (req, res) =>{
  con.query('SELECT * FROM users', (err, results) =>{
    if(err){
      return res.status(500).json({error: err});
    }
    res.json(results);
  })
})

app.listen(port, () => {console.log('Server running on http://localhost:8080')});


