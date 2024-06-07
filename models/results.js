const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
  teamName: {
    type: String,
    required: true
  },
  players: [{
    name: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    }
  }],
  points: {
    type: Number,
    required: true
  },
});

module.exports = mongoose.model('Result', matchSchema);
