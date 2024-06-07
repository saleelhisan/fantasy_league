

const express = require('express');
const router = express.Router();
const { Players, validatePlayer } = require('../models/players');
const { getRole } = require('../utils/functions')


router.post('/', async (req, res) => {

    try {

        const playersData = req.body;

        // Validation
        if (!Array.isArray(playersData) || playersData.length === 0) {
            return res.status(400).json({ message: 'Invalid data format. Expected an array of player objects.' });
        }

        const validPlayers = [];
        const invalidPlayers = [];

        //check for any invalid players
        for (const player of playersData) {
            const { error } = validatePlayer(player);
            if (error) {
                invalidPlayers.push({ name: player.Player, error: error.details[0].message });
            } else {
                validPlayers.push({
                    name: player.Player,
                    type: getRole(player.Role),
                    team: player.Team
                });
            }
        }


        const insertResult = await Players.insertMany(validPlayers, { ordered: false });
        const insertedCount = insertResult.insertedCount;
        res.status(201).json({
            message: 'Players added successfully!',
            totalProcessed: playersData.length,
            insertedCount,
            invalidPlayers: invalidPlayers.length > 0 ? invalidPlayers : 0
        });



    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Some players already exist in the database.' });
        } else {
            return res.status(500).json({ message: error.message });
        }
    }
});




module.exports = router;
