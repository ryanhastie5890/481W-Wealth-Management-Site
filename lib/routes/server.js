// updated server.js to use ES6 latest syntax
import express from 'express';                      // main web framework for HTML/CSS/JS, handling POST/GET requests.
import http from 'http';                            // server that Express runs on
import path from 'path';                            // file and directory paths across different operating systems             
import session from 'express-session';              // middleware for express. Track user sessions.  
import { fileURLToPath } from 'url';                // converts ES module file URLs into regular file paths
import { dirname } from 'path';                     // extracts the directory name from a file path

// imports routes to other server side js files
import authRoutes from './auth.js';
import sessionRoutes from './session.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

// setup middleware
app.use(express.static(path.join(__dirname, '../../public')));  // for static files: HTML/CSS/JS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'FIXME_temp_string_replace_in_future',
  resave: false,
  saveUninitialized: false
}));

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

// mount routes
app.use(authRoutes);
app.use(sessionRoutes);

// connection to server (localhost)
server.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
