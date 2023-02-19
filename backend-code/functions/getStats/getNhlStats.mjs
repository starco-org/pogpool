const SCHEDULE_API_BASE = 'https://statsapi.web.nhl.com/api/v1/schedule'
const GAME_API_BASE = 'https://statsapi.web.nhl.com/api/v1/game'

function getTodaysDate() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}-${month}-${day}`
}

export function getTodaysLineScore() {
    const today = getTodaysDate()
    const url = `${SCHEDULE_API_BASE}?date=${today}&hydrate=linescore`
    return fetch(url)
        .then((response) => response.json())
        .catch((error) => console.error(error))
}

export function getBoxScore(gameId) {
    const url = `${GAME_API_BASE}/${gameId}/boxscore`
    return fetch(url)
        .then((response) => response.json())
        .catch((error) => console.error(error))
}
