import { Sector } from '../../interfaces/Sector'
import { G } from '../../global'
import { changeLevel } from '../../maps/changeLevel'
import { parseLevel } from './parseLevel'

export const exit_to_secret_level = (_: Sector) => {
    const { mapName } = G

    let { e } = parseLevel(mapName) ?? { e: 1, m: 0 }
    changeLevel(`e${e}m9`)
    G.previousMapName = mapName
}
