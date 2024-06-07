
const express = require('express');
const router = express.Router();
const { getRoleCounts, validateRoleCounts } = require('../utils/functions')
const { Team, teamJoiSchema } = require('../models/team');
const { Players } = require('../models/players');




router.post('/', async (req, res) => {
    try {
        const { name, players, captain, viceCaptain } = req.body
        const { error } = teamJoiSchema(req.body)

        //validations
        if (error && error.details) {
            return res.status(400).json({ error: error.details[0].message })
        } else if (error) {
            return res.status(400).json({ error })
        }

        const playerDocs = await Players.find({ name: { $in: players } })

        //Min and Max player 
        const rolecount = getRoleCounts(playerDocs)
        const validationError = validateRoleCounts(rolecount)
        if (validationError) {
            return res.status(400).json({ error: validationError })
        }

        //if player not found in original playerslist
        if (playerDocs.length !== players.length) {
            return res.status(400).json({ error: "Some player IDs are invalid or do not exist" })
        }

        //storing player role and player role
        const transformedPlayerDocs = playerDocs.map(player => ({
            playerName: player.name,
            role: player.type
        }));

        const team = new Team({
            name,
            players:transformedPlayerDocs,
            captain,
            viceCaptain,
            points: 0                        //initialise points as zero
        });
        await team.save();
        return res.status(201).json({ message: 'Team created successfully', team })

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({ message: 'Team already exists in the database.' })
        } else {
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }

});


module.exports = router;
