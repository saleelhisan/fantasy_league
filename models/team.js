// models/team.js

const mongoose = require('mongoose');
const Joi = require('joi');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  players: [{
    playerName: { type: String, required: true },
    role: { type: String, required: true }
  }],
  captain: {  
    type:String,
    // type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  viceCaptain: {
    type:String,
    // type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true, 
  },
  points: {
    type: Number,
    default: 0,
  },
});

const Team = mongoose.model('Team', teamSchema);

const teamJoiSchema = (team) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'Team name is required.',
      'string.empty': 'Team name cannot be empty.', 
    }),
    players: Joi.array().items(Joi.string().required()).min(11).max(11).unique(), 
    captain: Joi.string().required(), 
    viceCaptain: Joi.string().required(), 
    points: Joi.number().default(0)
  });

  const { error } = schema.validate(team);
  if (error) return { error };

  
  const { players, captain, viceCaptain } = team;
  const uniquePlayers = new Set(players);
  if (uniquePlayers.size !== players.length) {
    return { error: "Players array must contain unique players" };
  }
  if (captain === viceCaptain) {
    return { error: "Captain and vice-captain must be different players" };
  }

  return { value: team }; 
};

module.exports = {
  Team,
  teamJoiSchema
};
