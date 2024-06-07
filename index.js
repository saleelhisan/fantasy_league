require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');

//for loging requests
app.use(morgan('combined')); 

//routers
const teamsRouter = require('./routes/teams')
const playerRouter = require('./routes/players')
const matchRouter = require('./routes/matches')
const resultRouter = require('./routes/results')

  // Database Details
const port = process.env['PORT'] || 3000


const URI = process.env['MONGODB_URL'];
const connectToDatabase = async () => { // Asynchronous connection function
  try {
    await mongoose.connect(URI);
    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
};

// Error Handler
const handleError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
  next(); 
}; 

//json parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/add-players', playerRouter);
app.use('/add-team', teamsRouter);
app.use('/process-result', matchRouter);
app.use('/team-result', resultRouter);

// Error Handling Middleware
app.use(handleError)

connectToDatabase();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
