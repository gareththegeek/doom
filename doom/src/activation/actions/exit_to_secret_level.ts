import { Sector } from 'doom-map'
import { G } from '../../global'
import { changeLevel } from '../../maps/changeLevel'
import { parseLevel } from './parseLevel'

export const exit_to_secret_level = (_: Sector) => {
    const {
        map: { name }
    } = G

    let { e } = parseLevel(name) ?? { e: 1, m: 0 }
    changeLevel(`e${e}m9`)
    G.previousMap = name
}
