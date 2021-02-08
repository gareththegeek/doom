import { Stateful } from '../interfaces/State'

export const removeFromSector = (stateful: Stateful): void => {
    stateful.sector.statefuls.remove(stateful)
}
