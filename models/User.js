// Mongoose is open-sourced with the MIT license and is also maintained by MongoDB, Inc.
// Mongoose provides an object data modeling (ODM) environment that wraps the Node.js native driver.
// Mongoose's main value is that you can define schemas for your collections, which are then enforced at the ODM layer by Mongoose.
var mongoose = require('mongoose');

//Mongoose Schema
var UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, index: true, unique: true, required: [true, 'Do you even email?'] },
  hashedPassword: { type: String, required: true },
  taskList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
