import { Stateful } from '../interfaces/State'

export const removeFromSector = (stateful: Stateful): void => {
    stateful.sector.statefuls.splice(stateful.sector.statefuls.indexOf(stateful), 1)
}
