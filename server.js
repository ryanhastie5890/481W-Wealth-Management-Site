const express = require('express');  // main web framework for HTML/CSS/JS, handling POST/GET requests.

// not needed right now. may need in the future for bi-direction data possibly real-time updates.
// const http = require('http');  
// const socketIo = require('socket.io');

const path = require('path');
const dbCon = require('./database.js').dbCon; // connect to DB
const session = require('express-session');  // middleware for express. Track user sessions.
const bodyParser = require('body-parser');   // 
const bcrypt = require('bcrypt');            // password hashing

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const user_sockets = {} // map screennames to socket.id

// setup middleware
app.use(express.static(__dirname));  // for static files: HTML/CSS/JS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'FIXME_temp_string_replace_in_future',
  resave: false,
  saveUninitialized: false
}));

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    dbCon.query(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, hash],
      (err) => {
        if (err) return res.status(400).send("User already exists");
        res.send("Registration successful");
      }
    );
  } catch (e) {
    res.status(500).send("Server error");
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  dbCon.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err || results.length === 0) return res.status(401).send("Invalid credentials");
      const user = results[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).send("Invalid credentials");
      req.session.userId = user.id; // <-- store logged-in user in session
      res.send("Login successful");
    }
  );
});

server.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});

// main sockeet.io logic
// io.on('connection', (socket) => {
//   socket.on('to-server', (msg) => {

//   })
// });