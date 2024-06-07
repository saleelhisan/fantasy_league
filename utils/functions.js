function getRole(role) {
    const roles = {
      'WICKETKEEPER': 'WK',
      'BATTER': 'BAT',
      'ALL-ROUNDER': 'AR',
      'BOWLER': 'BWL'
    };
    return roles[role] || 'UNKNOWN';
  }
  function getPlayerIdByName(players, playerName) {
    if (Array.isArray(playerName)) {
      const playerIds = [];
      playerName.forEach(name => {
        const player = players.find(player => player.name === name);
        if (player) {
          playerIds.push(player._id);
        }
      });
      return playerIds;
    } else {
      const player = players.find(player => player.name === playerName);
      return player ? player._id : null;
    }
  }
  
  
  const getRoleCounts = (playerDocs) => {
    const roleCounts = {
      'WK': 0,
      'BAT': 0,
      'AR': 0,
      'BWL': 0
    };
  
    playerDocs.forEach(player => {
      const role = player.type;
      if (roleCounts.hasOwnProperty(role)) {
        roleCounts[role]++;
      }
    });
  
    return roleCounts;
  };
  const validateRoleCounts = (roleCounts) => {
    const limits = {
      WK: { min: 1, max: 8 },
      BAT: { min: 1, max: 8 },
      AR: { min: 1, max: 8 },
      BWL: { min: 1, max: 8 }
    };
  
    for (const role in limits) {
      const count = roleCounts[role] || 0;
      const { min, max } = limits[role];
      if (count < min || count > max) {
        return `Role ${role} must have between ${min} and ${max} players, but got ${count}`;
      }
    }
  
    return null;
  };
  

   
     //Update individual runs
     const updatePlayerRuns = (playerName, runs,playerRuns) =>
      playerRuns[playerName] += runs
  
    //Update individual wickets
    const updatePlayerWickets = (playerName,playerWicket) =>
      playerWicket[playerName] += 1
  
    //Update individual catches
    const updatePlayerCatches = (playerName,playerCatch) =>
      playerCatch[playerName] += 1

    //find winner
    function findWinners(teams) {
      // 1. Extract team points
      const teamPoints = teams.map(team => team.points);
    
      // 2. Find the maximum points
      const maxPoints = Math.max(...teamPoints);
    
      // 3. Filter teams with the maximum points
      const winners = teams.filter(team => team.points === maxPoints);
    
      // 4. Handle winner selection
      if (winners.length === 1) {
        return winners[0].teamName;
      } else {
        // Tie scenario: 
        const winnerNames = winners.map(winner => winner.teamName).join(', ');
        return winnerNames;
      }
    }



  
  module.exports = {
    getRole,
    getRoleCounts,
    validateRoleCounts,
    getPlayerIdByName,
    updatePlayerRuns,
    updatePlayerWickets,
    updatePlayerCatches,
    findWinners
  };