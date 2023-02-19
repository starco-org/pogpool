import { groups } from './groups.mjs'

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
}

const GROUP_SEQUENCE = [
    'f1',
    'f2',
    'f3',
    'f4',
    'f5',
    'f6',
    'f7',
    'f8',
    'f9',
    'f10',
    'f11',
    'f12',
    'f13',
    'f14',
    'f15',
    'f16',
    'f17',
    'f18',
    'f19',
    'f20',
    'f21',
    'f22',
    'f23',
    'f24',
    'd1',
    'd2',
    'd3',
    'd4',
    'd5',
    'd6',
    'd7',
    'd8',
    'd9',
    'd10',
    'd11',
    'd12',
    't1',
    't2',
    't3',
    't4',
    'sc'
]

export function initState() {
    const player_lookup = {}
    const team_lookup = {}
    const group_lookup_by_pick = {}
    const group_lookup_by_group = {}
    const pick_lookup = {}
    const pick_count_by_group = {}

    groups.forEach((g) => {
        // note: what do these conditions mean?
        const conditionA = !g.id.includes('Name') && g.id.startsWith('f')
        const conditionB = g.id.startsWith('d')
        const conditionC = g.id.startsWith('t')

        if (conditionA || conditionB) {
            g.options.forEach((p) => {
                player_lookup[p.id] = p
                pick_lookup[p.id] = { goals: 0, assists: 0, points: 0 }
                group_lookup_by_pick[p.id] = g.id
            })
        } else if (conditionC) {
            g.options.forEach((t) => {
                team_lookup[t.id] = t
                pick_lookup[t.id] = {
                    wins: 0,
                    shutouts: 0,
                    losses_r1: 0,
                    losses_r2: 0,
                    losses_r3: 0,
                    points: 0
                }
                group_lookup_by_pick[t.id] = g.id
            })
        }

        g.options.forEach((option) => {
            if (!group_lookup_by_group[g.id]) {
                group_lookup_by_group[g.id] = {}
            }
            group_lookup_by_group[g.id][option.id] = true
        })
    })

    return {
        player_lookup,
        team_lookup,
        group_lookup_by_pick,
        group_lookup_by_group,
        pick_lookup,
        pick_count_by_group
    }
}
