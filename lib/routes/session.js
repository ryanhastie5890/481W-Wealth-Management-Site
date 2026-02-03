// server side sessions.
import express from 'express';

const router = express.Router();

router.get('/message', (req, res) => {
  const msg = req.session.message || "";
  req.session.message = null; // clear message after reading
  res.send(msg);
});

router.get('/session', (req, res) =>{  //get session info
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

export default router;