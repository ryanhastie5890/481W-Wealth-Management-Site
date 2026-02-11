import express from 'express';                 // main web framework for HTML/CSS/JS, handling POST/GET requests.
import path from 'path';                       // file and directory paths across different operating systems
import session from 'express-session';         // middleware for express. Track user sessions.
import routes from './routes/index.js';        // file for all API endpoints

import { fileURLToPath } from 'url';           // converts ES module file URLs into regular file paths
import { dirname } from 'path';                // extracts the directory name from a file path

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();



// Global middware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'FIXME_temp_string_replace_in_future',
    resave: false,
    saveUninitialized: false
}));
// directs user to login.html if not logged in else to index.html
app.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login.html');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(express.static(path.join(__dirname, 'public')));  // static files: HTML/CSS/JS
// Global routes
app.use('/api', routes);

export default app;