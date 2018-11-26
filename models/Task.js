// Mongoose is open-sourced with the MIT license and is also maintained by MongoDB, Inc.
// Mongoose provides an object data modeling (ODM) environment that wraps the Node.js native driver.
// Mongoose's main value is that you can define schemas for your collections, which are then enforced at the ODM layer by Mongoose.
var mongoose = require('mongoose');

//Mongoose Schema
var TaskSchema = new mongoose.Schema({
  taskTitle: String,
  taskDescription: String,
  dateAdded: Date,
  dateDue: Date,
  // userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

mongoose.model('Task', TaskSchema);

module.exports = mongoose.model('Task');
