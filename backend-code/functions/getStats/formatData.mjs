import { getTodaysLineScore, getBoxScore } from './nhlStats.mjs'

const TEAM_NAME_MAPPING = {
    'Boston Bruins': 'BOS',
    'Calgary Flames': 'CGY',
    'Carolina Hurricanes': 'CAR',
    'Colorado Avalanche': 'COL',
    'Dallas Stars': 'DAL',
    'Edmonton Oilers': 'EDM',
    'Florida Panthers': 'FLA',
    'Los Angeles Kings': 'LAK',
    'Minnesota Wild': 'MIN',
    'Nashville Predators': 'NSH',
    'New York Rangers': 'NYR',
    'Pittsburgh Penguins': 'PIT',
    'St. Louis Blues': 'STL',
    'Tampa Bay Lightning': 'TBL',
    'Toronto Maple Leafs': 'TOR',
    'Washington Capitals': 'WSH'
}

async function getTodaysGames() {
    const res = await getTodaysLineScore()

    let results = []
    res.dates.forEach((date) => {
        date.games.forEach((game) => {
            if (game.status.abstractGameState == 'Preview') {
                return
            }

            results.push({
                id: game.gamePk,
                date: date.date,
                home_team: TEAM_NAME_MAPPING[game.teams.home.team.name],
                away_team: TEAM_NAME_MAPPING[game.teams.away.team.name],
                home_score: game.teams.home.score,
                away_score: game.teams.away.score,
                current_period: game.linescore.currentPeriodOrdinal,
                time_remaining: game.linescore.currentPeriodTimeRemaining,
                final: game.status.abstractGameState === 'Final'
            })
        })
    })

    return results

    const ress = await scrapeStatsForGameId(results[0].id)
}

async function getStatsForGame(game_id) {
    const game_stats = await getBoxScore(game_id)
    let player_results = []
    ;['home', 'away'].forEach((home_or_away) => {
        const playerData = Object.values(game_stats.teams[home_or_away].players)
        playerData.forEach((player_json) => {
            ;['skaterStats', 'goalieStats'].forEach((stats_key) => {
                if (stats_key in player_json.stats) {
                    const player_stats = player_json.stats[stats_key]
                    player_results.push({
                        id: player_json.person.id,
                        goals: player_stats.goals,
                        assists: player_stats.assists
                    })
                }
            })
        })
    })
    return player_results
}

export async function formatData() {
    const games = await getTodaysGames()

    let recordsToSave = []
    for (const game of games) {
        const id = game.id
        const date = game.date
        const stats = await getStatsForGame(id)

        for (const stat of stats) {
            const playerRecord = {
                PK: stat['id'].toString(),
                SK: date,
                goals: stat['goals'],
                assists: stat['assists']
            }

            recordsToSave.push(playerRecord)
        }

        if (game.final) {
            const homeResult = {
                PK: game['home_team'],
                SK: date,
                //round_number: round_number,
                wins: game['home_score'] > game['away_score'] ? 1 : 0,
                losses: game['away_score'] > game['home_score'] ? 1 : 0,
                shutouts: game['away_score'] === 0 ? 1 : 0
            }
            if (homeResult.PK) {
                recordsToSave.push(homeResult)
            }

            const awayResult = {
                PK: game['away_team'],
                SK: date,
                //round_number: round_number,
                wins: game['away_score'] > game['home_score'] ? 1 : 0,
                losses: game['home_score'] > game['away_score'] ? 1 : 0,
                shutouts: game['home_score'] === 0 ? 1 : 0
            }

            if (awayResult.PK) {
                recordsToSave.push(awayResult)
            }
        }
    }

    return recordsToSave
}
