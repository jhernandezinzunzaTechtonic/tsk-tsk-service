const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');  // Dont need just yet
const cors = require('cors');
const port = process.env.PORT || 4000;
const db = require('./db');

const TaskController = require('./controllers/TaskController');
const UserController = require('./controllers/UserController');

//CORS Access lift (we eventually want to add security using JWT and whitelist our platforms IP's)
app.use(cors());

app.use('/tsktsk', TaskController);
app.use('/auth', UserController); // Not set up yet


//FORMAT OF token
//Authorization: Bearer <access_token>
// Verify token

// function verifyToken_MW(req, res, next) {
//   //Get auth header value
//   console.log(req.headers['authorization']);
//   const bearerHeader = req.headers['authorization'];
//   // Check if bearer is undefined
//   if (typeof bearerHeader !== 'undefined') {
//     //Split at the space
//     const bearer = bearerHeader.split(' ');
//     // Get token from array
//     const bearerToken = bearer[1];
//     // Set the bearerToken
//     req.token = bearerToken;
//     // Next middleware
//     next();
//   } else {
//     //Forbidden
//     res.sendStatus(403);
//   }
// }

//Route for 404 page
app.get('*', (req, res) => res.status(404).send('Not found')); // HTTP status 404: NotFound

app.listen(port, () => console.log(`Listening on port ${port}!`));

//Export Module in Node.js
//The module.exports or exports is a special object which is included in every JS file in the Node.js application by default.
//Module is a variable that represents current module and exports is an object that will be exposed as a module.
module.exports = app;
