
const express = require('express');
const router = express.Router();
const { Team } = require('../models/team')
const fs = require('fs');
const path = require('path');
const pointsHandler = require('../helpers/points.functions');
const results = require('../models/results');
const matchFilePath = path.join(__dirname, '../data', 'match.json');
const matchData = fs.readFileSync(matchFilePath, 'utf-8');
const parsedMatch = JSON.parse(matchData)


router.post('/', async (req, res) => {
  try {
    const teams = await Team.find()
    const matchResults = [];
    let totalPoints = 0;

    //executing points calculator for each team
    teams.forEach(team => {
      const {points} = pointsHandler(parsedMatch, team)

      //calculate total points
      for (const playerName in points) {
        totalPoints += points[playerName];
      }

      //for storing playerpoints
      const playersArray = Object.entries(points).map(([name, points]) => ({
        name,
        points:points
      }));
      matchResults.push({ teamName: team.name, points:totalPoints,players: playersArray});

    });



    const result = await results.insertMany(matchResults, { ordered: true });
    res.json({ message: 'Match results saved successfully!', data: result });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

})




module.exports = router;