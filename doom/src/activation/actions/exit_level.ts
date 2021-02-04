import { Sector } from '../../interfaces/Sector'
import { G } from '../../global'
import { changeLevel } from '../../maps/changeLevel'
import { parseLevel } from './parseLevel'

export const exit_level = (_: Sector) => {
    let { previousMapName, mapName } = G

    if (previousMapName !== undefined) {
        mapName = previousMapName
    }

    let { e, m } = parseLevel(mapName) ?? { e: 1, m: 0 }
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
    G.previousMapName = undefined
}
