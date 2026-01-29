const express = require('express');  // main web framework for HTML/CSS/JS, handling POST/GET requests.


const http = require('http');  
// const socketIo = require('socket.io'); // not needed right now. may need in the future for bi-direction data possibly real-time updates.

const path = require('path');
const dbCon = require('./database.js').dbCon; // connect to DB
const session = require('express-session');  // middleware for express. Track user sessions.
const bodyParser = require('body-parser');   // 
const bcrypt = require('bcrypt');            // password hashing

const app = express();
const server = http.createServer(app);
// const io = socketIo(server);  // not needed right now. may need in the future for bi-direction data possibly real-time updates.

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

// FIX ME:register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    dbCon.query(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, hash],
      (err) => {
        if (err) {
          req.session.message = "User already exists";
          return res.redirect('/');
        }
        req.session.message = "Registration successful";
        return res.redirect('/');
      }
    );
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// FIX ME: login 
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  dbCon.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err || results.length === 0) return res.status(401).send("Invalid credentials");

      const user = results[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        req.session.message = "Invalid credentials";
        return res.redirect('/');
      }
      req.session.userId = user.id; // store logged-in user id in session
      req.session.email = user.email;  // store logged-in user email in session
      req.session.message = "Login successful";
      return res.redirect('/');
    }
  );
});

// returns a message to the client
app.get('/message', (req, res) => {
  const msg = req.session.message || "";
  res.send(msg);
});

// returns the session login status and the user email to the client
app.get('/session-info', (req, res) => {
  if (req.session.userId) {
    res.json({ 
      loggedIn: true, 
      email: req.session.email 
    });
  } 
  else {
    res.json({ loggedIn: false });
  }
});

// FIX ME: connect to local host in this case it is hard coded 8080
server.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});

// main sockeet.io logic
// io.on('connection', (socket) => {
//   socket.on('to-server', (msg) => {

//   })
// });