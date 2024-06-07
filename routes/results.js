const express = require('express');
const results = require('../models/results');
const { findWinners } = require('../utils/functions');
const router = express.Router();

router.get('/',async(req,res)=>{
    try{
        const result = await results.find({});
        const winner = findWinners(result)
        res.json({ winner });
        return;
    }catch(error){
        console.error(error);
        res.status(500).send('Error fetching results and finding winner');
    }
})


module.exports = router;
