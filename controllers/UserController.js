import { createJWToken } from '../libs/Auth';
import { verifyJWTToken } from '../libs/Auth';
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
// This is your user model,aka the schema definition for your user document.  This is a Mongoose model.  For more information, see https://mongoosejs.com/docs/models.html.
const User = require('../models/User');

// Use the express.Router class to create modular, mountable route handlers.  For more info, see https://expressjs.com/en/guide/routing.html.
// A Router instance is a complete middleware and routing system.
const router = express.Router();

// body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body
// The middleware was a part of Express.js earlier, but now you have to install it separately.  For more info, see https://github.com/expressjs/body-parser.
// This body-parser module, parses the JSON, buffer, string and URL-encoded data submitted using an HTTP POST request.  For more info, see https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express.
// limit
router.use(bodyParser.json({ extended: true, limit: '5mb' }));

// Register user, does not allow duplicate emails.
router.post('/register', (req, res) => {
  let hashedPassword = bcrypt.hashSync(req.body.password, 8); // req.body.password must exist, see terminal for error
  User.create({
      username: req.body.username,
      email: req.body.email,
      hashedPassword: hashedPassword,
      taskList: new Array(),
    }, (err, user) => {
      if (err) return res.status(500).send(err.message);
      res.status(200).send({ auth: true, token: createJWToken({ sessionData: user, maxAge: 3600 }), name: user.username, email: user.email });
    });
});

// Make sure users token is valid.
router.get('/verify', (req, res) => {
  let token = req.headers['x-access-token'];
  verifyJWTToken(token)
  .then(function (decodedToken) {
    res.status(200).send({ auth: true, token: token });
  })
  .catch(function (error) {
    res.status(200).send({ auth: false, token: null, message: 'Invalid auth token provided.' });
  });
});

// Log-in the user.
router.post('/login', (req, res) => {
  console.log(req.body.email);
  User.findOne({ email: req.body.email },
    function (err, user) {
      if (err) { // Catch common errors first/
        return res.status(500).send('Error on the server.');
      } else if (!user) {
        return res.status(500).send('No user found.');
      } else if (bcrypt.compareSync(req.body.password, user.hashedPassword)) {  // Check password. NOTE: Name is returned as an object.
        return res.status(200).send({ auth: true, token: createJWToken({ sessionData: user, maxAge: 3600 }), name: user.username, email: user.email });
      } else {
        return res.status(401).send({ auth: false, token: null, message: 'Invalid password provided' });
      }
    });
});

//need to find the user, then edit the desired fields. Email/userName/Password?? gonna need to send old and new email in body.
// //UserSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email: { type: String, index: true, unique: true, required: [true, 'Do you even email?'] },
//   hashedPassword: { type: String, required: true },
//   taskList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],

router.put('/edituser', (req, res) => {
  //NOTE: could also do pasword changes here, not sure how that affects tokens tho.
  console.log('edituser ran');
  console.log(req.body);
  let edits = {};
  let oldEmail;

  if (req.body) {
    oldEmail = req.body.oldemail;

    if (req.body.newemail) {
      edits.email = req.body.newemail;
    };

    if (req.body.username) {
      edits.username = req.body.username;
    };

  };

  User.findOneAndUpdate({ email: oldEmail }, edits, { new: true })
  .exec((err, user) => {
    if (err) {
      console.log(err.codeName);
      if (err.codeName == 'DuplicateKey') {
        return res.status(500).send('Duplicate email');
      } else {
        return res.status(500).send('problem editing user');
      }
    } else {
      let userCredRes = {
        username: user.username,
        email: user.email,
      };
      res.status(200).send(userCredRes);
    }
  });
});

// How do we want to handle this?
router.get('/logout', (req, res) => res.status(200).send({ auth: false, token: null }));

module.exports = router;
