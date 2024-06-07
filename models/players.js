const mongoose = require('mongoose');
const Joi = require('joi');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  type: {
    type: String,
    enum: ['WK', 'BAT', 'AR', 'BWL'],
    required: true
  },
  team : {
    type : String,
    required : true,
  }
});

// playerSchema.index({ name: 1 }, { unique: true });
const Players = mongoose.model('Players', playerSchema);


const validatePlayer = (player) => {
    const schema = Joi.object({
      Player: Joi.string().required(),
      Team: Joi.string().required(),
      Role: Joi.string().valid('WICKETKEEPER', 'BATTER', 'ALL-ROUNDER', 'BOWLER').required()
    });
  
    return schema.validate(player);
  };


  
  module.exports = {
    Players,
    validatePlayer
  };
