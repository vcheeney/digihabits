const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const habitSchema = mongoose.Schema({
  action: { type: String, trim: true },
  creationDate: { type: Date },
  recurrence: { type: [Number] },
  achievedDates: { type: [Date] },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Habit', habitSchema);
