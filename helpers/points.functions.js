const CONSTANTS = require('../constants/bonus.constants')
const {  updatePlayerRuns, updatePlayerWickets,updatePlayerCatches } = require('../utils/functions')

function pointsHandler(matchData, players) {
  const captain = players.captain
  const viceCaptain = players.viceCaptain
  const team = players.players
  // let totalPoints = 0

  //individual player stats
  const playerPoints = {}
  const playerRuns = {}
  const playerWicket = {}
  const playerCatch = {}

  //initialising players
  team.forEach(player => {
    playerPoints[player.playerName] = 0
    playerRuns[player.playerName] = 0
    playerWicket[player.playerName] = 0
    playerCatch[player.playerName] = 0
  })

  //score flags
  let thirtyBonus = false
  let fiftyBonus = false
  let centuryBonus = false

  //over details
  let previousOver = { bowler: null, runs: null }
  let currentOver = { bowler: null, runs: null, over: 0 }

  //update individual points
  const updatePlayerPoints = (playerName, points,playerPoints) => {

    if (playerName === captain)
      playerPoints[playerName] += points * 2

    else if (playerName === viceCaptain)
      playerPoints[playerName] += points * 1.5

    else
      playerPoints[playerName] += points

  }
 
  // Loop through each ball
  matchData.forEach(ball => {

    //Handle batting
    if (playerPoints.hasOwnProperty(ball.batter)) {

      //handle run scored by batter
      if (ball.batsman_run > 0) {
        updatePlayerPoints(ball.batter, ball.batsman_run,playerPoints)
        updatePlayerRuns(ball.batter, ball.batsman_run,playerRuns)

        //handle boundaries  
        if (ball.batsman_run === 4) {
          updatePlayerPoints(ball.batter, CONSTANTS.BOUNDARY_BONUS,playerPoints)    // Boundary Bonus
        } else if (ball.batsman_run === 6) {
          updatePlayerPoints(ball.batter, CONSTANTS.SIX_BONUS,playerPoints)         // Six Bonus
        }
      }

      // Dismissal for a duck
      if (ball.batsman_run === 0 && ball.isWicketDelivery === 1 && playerRuns[ball.batter] === 0) {
        const batterRole = team.find(player => player.playerName === ball.batter).role
        if (batterRole === 'BAT' || batterRole === 'WK' || batterRole === 'AR') {
          updatePlayerPoints(ball.batter, CONSTANTS.DUCK_OUT_PENALTY,playerPoints)
        }
      }
    }


    // Check if a batter has scored 30, 50 or 100 runs
    const batterRuns = playerRuns[ball.batter]

    if (batterRuns >= 30 && !thirtyBonus) {
      thirtyBonus = true
      updatePlayerPoints(ball.batter, CONSTANTS.THIRTY_RUN_BONUS,playerPoints)  // 30 Run Bonus
    }

    if (batterRuns >= 50 && !fiftyBonus) {
      fiftyBonus = true
      updatePlayerPoints(ball.batter, CONSTANTS.FIFTY_RUN_BONUS,playerPoints)   // Half-century Bonus
    }

    if (batterRuns >= 100 && !centuryBonus) {
      centuryBonus = true
      updatePlayerPoints(ball.batter, CONSTANTS.CENTURY_BONUS,playerPoints)     // Century Bonus
    }



    //Handle bowling
    if (playerPoints.hasOwnProperty(ball.bowler)) {

      if (ball.isWicketDelivery) {
        updatePlayerWickets(ball.bowler,playerWicket)

        if (ball.kind !== 'runout')
          updatePlayerPoints(ball.bowler, CONSTANTS.WICKET_BONUS,playerPoints)      // Wicket bonus

        if (['bowled', 'lbw'].includes(ball.kind))
          updatePlayerPoints(ball.bowler, CONSTANTS.LBW_BOWLED_BONUS,playerPoints)  // Clean Bowled/LBW Bonus

      }


      if (playerWicket[ball.bowler] >= 3)
        updatePlayerPoints(ball.bowler, CONSTANTS.THREE_WICKET_BONUS,playerPoints)  // 3 Wicket Bonus

      if (playerWicket[ball.bowler] >= 4)
        updatePlayerPoints(ball.bowler, CONSTANTS.FOUR_WICKET_BONUS,playerPoints)  // 4 Wicket Bonus

      if (playerWicket[ball.bowler] >= 3)
        updatePlayerPoints(ball.bowler, CONSTANTS.FIVE_WICKET_BONUS,playerPoints)  // 5 Wicket Bonus


      //for checking new over
      if (ball.ballnumber == 1 && ball.overs !== currentOver.over) {
        previousOver = {
          bowler: currentOver.bowler,
          runs: currentOver.runs
        }
        currentOver.bowler = ball.bowler
        currentOver.over = ball.overs
        currentOver.runs = 0
      }

      //for adding currentover run ( check maiden over)
      if (ball.overs === currentOver || ball.bowler === currentOver.bowler) {
        if (ball.total_run > 0) currentOver.runs += ball.total_run
      }

      if (previousOver.runs === 0 && ball.ballnumber === 1) {
        updatePlayerPoints(previousOver.bowler, CONSTANTS.MAIDEN_OVER_BONUS,playerPoints)    // maiden over bonus
        previousOver.runs = null
      }

    }

    //Handle fielding
    if (playerPoints.hasOwnProperty(ball.fielders_involved)) {

      if (ball.isWicketDelivery && ball.kind === 'caught') {
        updatePlayerPoints(ball.fielders_involved, CONSTANTS.CATCH_BONUS,playerPoints)  // Catch
        updatePlayerCatches(ball.fielders_involved,updatePlayerCatches)
      }

      if (ball.isWicketDelivery && ball.kind === 'stumping') {
        updatePlayerPoints(ball.fielders_involved, CONSTANTS.STUMPING_BONUS,playerPoints)  // Stumping
      }

      if (ball.isWicketDelivery && ball.kind === 'runout') {
        updatePlayerPoints(ball.fielders_involved, CONSTANTS.RUNOUT_BONUS,playerPoints)  // Run out
      }

    }


  })

  // for (const playerName in playerPoints) {
  //   totalPoints += playerPoints[playerName];
  // }

  return {
    points: playerPoints,
    runs: playerRuns,
  };

}

module.exports = pointsHandler;
