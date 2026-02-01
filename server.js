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
app.use(express.static(path.join(__dirname, 'public')));  // for static files: HTML/CSS/JS
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
        if (err) {
          console.error("MYSQL INSERT ERROR:", err);
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
      req.session.userId = user.id; // <-- store logged-in user in session
      req.session.email = user.email;
      req.session.message = "Login successful!";
      return res.redirect('/');
    }
  );
});

app.get('/message', (req, res) => {
  const msg = req.session.message || "";
  req.session.message = null; // clear message after reading
  res.send(msg);
});

app.get('/session', (req, res) =>{  //get session info
  //get user email
  if(req.session.userId != null){
    res.json({
      loggedIn: true,
      userId: req.session.userId,
      email: req.session.email
    });
  } 
  else {
    res.json({
      loggedIn: false
    });
  }
});

app.post('/add-property', (req, res)=>{  //create property
  const { name, description, type, status, occupants } = req.body;
  const userId = req.session.userId || null;

  if(userId != null){
  dbCon.query("INSERT INTO properties (userId, name, description, type, status, occupants) VALUES (?,?,?,?,?,?)",
    [userId, name, description, type, status, occupants],
    (err, result) =>{
      if(err){
        console.error("DATA INSERT ERROR:",err);
        return res.status(500).send("Error creating property");
      }
      res.redirect('/RealEstate.html')
    }
  )}


});

app.get('/get-properties', (req, res) =>{//retrieve properties to display
  if(!req.session.userId){
    return res.status(401).json({error: "You are not logged in"});
  }
  dbCon.query("SELECT id, name, description, type, status, occupants, created_at FROM properties WHERE userId = ?",
    [req.session.userId],
    (err, results) => {
      if(err){
        console.error("Failed to retrieve properties:", err);
        return res.status(500).json({error: "Db error"});
      }
      res.json(results);
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
