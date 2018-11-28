import { verifyJWT_MW } from '../middlewares';
import { filterTasks } from '../libs/Task';
const express = require('express');
const bodyParser = require('body-parser');
// This is your Task model,aka the schema definition for your task document.  This is a Mongoose model.  For more information, see https://mongoosejs.com/docs/models.html.
const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

// Use the express.Router class to create modular, mountable route handlers.  For more info, see https://expressjs.com/en/guide/routing.html.
// A Router instance is a complete middleware and routing system.
const router = express.Router();

router.all('*', verifyJWT_MW);

// body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body
// This body-parser module, parses the JSON, buffer, string and URL-encoded data submitted using an HTTP POST request.
// limit controls the maximum request body size. If this is a number, then the value specifies the number of bytes; if it is a string, the value is passed to the bytes library for parsing. Defaults to '100kb'.
router.use(bodyParser.json({ extended: true, limit: '5mb' }));

router.get('/', (req, res) => {
  let userID = mongoose.Types.ObjectId(req.user._doc._id);
  User.findOne({ _id: userID })
  .populate('taskList')
  .exec((err, result) => {
    let finalList = filterTasks(req.headers.pathname, result.taskList);
    if (err) return res.status(500).send('There was a problem retrieving the tasks');
    res.status(200).send(finalList);
  });
});

// Create a new task and post it to the database.
router.post('/', (req, res) => {
  console.log(req.body);
  let userID = mongoose.Types.ObjectId(req.user._doc._id);
  Task.create({
    taskTitle: req.body.taskTitle,
    taskDescription: req.body.taskDescription,
    dateAdded: req.body.dateAdded,
    dateDue: req.body.dateDue,
    completed: false,
  }, function (err, task) {
      if (err) {
        return res.status(500).send('There was a problem creating the task');
      } else { // If task can be added, create relationship for specific user adding this task.
        User.updateOne({ _id: userID }, { $push: { taskList: task._id } }, { new: true }, function (err, thing) {
        console.log('updated taskList array');
        });
        return res.status(200).send(task);
      }
    });
});

// Delete a task from the database.
router.delete('/', function (req, res) { //using deleteMany for future use
  let userID = mongoose.Types.ObjectId(req.user._doc._id);
  let taskID = mongoose.Types.ObjectId(req.body._id);
  Task.deleteMany({ _id: req.body._id },
    function (err, task) {
      User.updateOne(
        {_id: userID }, { $pull: { taskList: taskID } }, function (err, response) {
          console.log('updated user array');
        }
      );

      if (err) return res.status(500).send('There was a problem removing the task.');
      res.status(200).send(task);
    });

});

// Create a PUT route that UPDATES A SPECIFIC SINGLE TASK IN THE DATABASE here.
router.put('/:id', function (req, res) {
  let taskID = mongoose.Types.ObjectId(req.params.id);
  Task.findOneAndUpdate({ _id: taskID }, req.body, { new: true })
  .exec((err, books) => {
      if (err) return res.status(500).send('There was a problem updating the task.');
      res.status(200).send(books);
    });
});

module.exports = router;
