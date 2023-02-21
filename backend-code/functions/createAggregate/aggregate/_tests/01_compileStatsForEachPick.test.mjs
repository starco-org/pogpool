import test from 'node:test'
import assert from 'assert'
import { compileStatsForEachPick } from '../01_compileStatsForEachPick.mjs'
import { initState } from '../../initState/index.mjs'
import { testData } from './testData.mjs'

test('compileStateForEachPick will work', async (t) => {
    //
    const state = initState()
    try {
        const x = compileStatsForEachPick(state, testData)
        console.log(x)
    } catch (e) {
        console.log(e)
    }
    //assert.strictEqual(2, x)
})
