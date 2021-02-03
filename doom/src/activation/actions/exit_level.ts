import { Sector } from 'doom-map'
import { G } from '../../global'
import { changeLevel } from '../../maps/changeLevel'
import { parseLevel } from './parseLevel'

export const exit_level = (_: Sector) => {
    let {
        previousMap,
        map: { name }
    } = G

    if (previousMap !== undefined) {
        name = previousMap
    }

    let { e, m } = parseLevel(name) ?? { e: 1, m: 0 }
    m = m + 1
    if (m > 8) {
        e += 1
        m = 1
    }
    if (e > 4) {
        console.info('Ran out of levels')
        return
    }

    changeLevel(`e${e}m${m}`)
    G.previousMap = undefined
}
