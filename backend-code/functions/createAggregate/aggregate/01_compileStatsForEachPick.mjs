export function compileStatsForEachPick(state, items) {
    const picks = items.filter((x) => {
        const pkIsStandings = x['pk'] !== 'standings'
        const skIsDate = x['sk'].length === 10 && x['sk'].startsWith('2023-')
        return pkIsStandings && skIsDate
    })

    picks.forEach((pick) => {
        let pick_id = ''
        let is_player = false
        try {
            pick_id = Number(pick['PK'])
            is_player = true
        } catch (e) {
            pick_id = pick['PK']
            is_player = false
        }

        if (is_player) {
            const goals = pick.goals
            const assists = pick.assists
            state.pick_lookup[pick_id] = {
                goals: 0,
                assists: 0,
                points: 0
            }
            state.pick_lookup[pick_id]['goals'] += goals
            state.pick_lookup[pick_id]['assists'] += assists
            state.pick_lookup[pick_id]['points'] += goals + assists
        } else {
            const wins = pick.wins
            const losses = pick.losses
            const shutouts = pick.shutouts
            const round_number = 1 //int(pick['round_number'])
            state.pick_lookup[pick_id]['wins'] += wins
            if (round_number === 1) {
                state.pick_lookup[pick_id]['losses_r1'] += losses
            }

            if (round_number === 2) {
                state.pick_lookup[pick_id]['losses_r2'] += losses
            }

            if (round_number === 3) {
                state.pick_lookup[pick_id]['losses_r3'] += losses
            }

            state.pick_lookup[pick_id]['shutouts'] += shutouts
            state.pick_lookup[pick_id]['points'] += 2 * wins + 2 * shutouts
        }
    })

    // 2. Determine which picks are eliminated
    Object.keys(state.pick_lookup).forEach((key) => {
        const isTeam = Number(key) === NaN
        let team_id = ''
        if (!isTeam) {
            team_id = player_lookup[pick_id]['team']
        } else {
            team_id = pick_id
        }

        const team_stats = pick_lookup[team_id]

        state.pick_lookup[key].stats['eliminated'] =
            team_stats['losses_r1'] === 4 ||
            team_stats['losses_r2'] === 4 ||
            team_stats['losses_r3'] === 4
    })

    return state
}
