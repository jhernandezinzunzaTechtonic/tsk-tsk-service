const verifyJWT_MW = require('../middlewares');
const express = require('express');
const bodyParser = require('body-parser');
// This is your Library model,aka the schema definition for your task document.  This is a Mongoose model.  For more information, see https://mongoosejs.com/docs/models.html.
const Task = require('../models/Task');
const mongoose = require('mongoose');

// Use the express.Router class to create modular, mountable route handlers.  For more info, see https://expressjs.com/en/guide/routing.html.
// A Router instance is a complete middleware and routing system.
const router = express.Router();

// router.all('*', verifyJWT_MW);

// body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body
// The middleware was a part of Express.js earlier, but now you have to install it separately.  For more info, see https://github.com/expressjs/body-parser.
// This body-parser module, parses the JSON, buffer, string and URL-encoded data submitted using an HTTP POST request.  For more info, see https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express.
// limit
// Controls the maximum request body size. If this is a number, then the value specifies the number of bytes; if it is a string, the value is passed to the bytes library for parsing. Defaults to '100kb'.
router.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
// router.use(bodyParser.json({ extended: true, limit: '5mb' }));

// Main get route to retrive tasks.
router.get('/', (req, res) => {
  Task.find({}, (err, taskList) => {
    if (err) return res.status(500).send('There was a problem retrieving the tasks');
    res.status(200).send(taskList);
  });
});

// Create a new task and post it to the database.
router.post('/', (req, res) => {
  Task.create({
    taskTitle: req.body.taskTitle,
    taskDescription: req.body.taskDescription,
    dateAdded: req.body.dateAdded,
    dateDue: req.body.dateDue,
    // userID: req.body.userID, // FOR FUTURE USE UPON IMPLEMENTATION OF USERS
  }, function (err, task) {
      if (err) return res.status(500).send('There was a problem creating the task');
      res.status(200).send(task);
    });
});

// Delete a task from the database.
router.delete('/', function (req, res) { //using deleteMany for future use
  console.log(req.body);
  Task.deleteMany({ _id: req.body._id },
    function (err, task) {
      if (err) return res.status(500).send('There was a problem removing the task.');
      res.status(200).send(task);
    });
});

// Create a PUT route that UPDATES A SPECIFIC SINGLE BOOK IN THE DATABASE here.
router.put('/:id', function (req, res) {
  Task.findOneAndUpdate(req.params._id, req.body, { new: true })
  .exec((err, books) => {
      if (err) return res.status(500).send('There was a problem updating the task.');
      res.status(200).send(books);
    });
});





// // Step 1. Create a GET route that RETURNS ALL THE BOOKS IN YOUR DATABASE here.
// router.get('/?', function (req, res) {
//   // console.log(req.user);
//   let queryData = buildMongoQuery(req.query, req.user._doc._id);
//   Library.countDocuments(queryData.query,
//     function (err, bookCount) {
//       Library.find(queryData.query).skip(queryData.skip).limit(queryData.limit).exec((err, books) => {
//         if (err) return res.status(500).send('There was a problem finding books.');
//         res.status(200).send({ count: bookCount, bookList: books });
//       });
//     });
// });

// // Create a GET route that GETS A RANDOM BOOK FROM YOUR DATABASE here.
// router.get('/random', function (req, res) {
//   let user = mongoose.Types.ObjectId(req.user._doc._id);
//   Library.aggregate()
//   .match({ userID: user })
//   .sample(1)
//   .exec((err, randomBook) => {
//     if (err) return res.status(500).send('There was a problem finding books.');
//     res.status(200).send(randomBook);
//   });
// });
//
// router.get('/showAllAuthors', function (req, res) {
//   let user = mongoose.Types.ObjectId(req.user._doc._id);
//   Library.find({ userID: user }).distinct('author',
//     function (err, authorList) {
//     if (err) return res.status(500).send('There was a problem finding books.');
//     res.status(200).send(authorList);
//   });
// });
//
// router.delete('/deleteBy?', function (req, res) {
//   if (req.query.title == '' && req.query.author == '') {
//     //Do nothing, no valid search.
//     console.log('No queries');
//   } else {
//     Library.deleteMany({
//       $or: [
//       { title: req.query.title },
//       { author: req.query.author },
//     ]}).exec((err, books) => {
//         if (err) return res.status(500).send('There was a problem finding books.');
//         res.status(200).send(books);
//       });
//   }
// });


module.exports = router;