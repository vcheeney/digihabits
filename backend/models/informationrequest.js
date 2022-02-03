const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var ObjectId = mongoose.Schema.Types.ObjectId;

const informationRequestSchema = mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  messageType: { type: String },
  message: { type: String }
});

module.exports = mongoose.model('InformationRequest', informationRequestSchema);
