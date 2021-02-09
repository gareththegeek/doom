import { removeFromBlock } from '../collisions/removeFromBlock'
import { removeFromSector } from '../collisions/removeFromSector'
import { G } from '../global'
import { Stateful } from '../interfaces/State'
import { freeStateful } from './allocateStateful'

export const removeStateful = (stateful: Stateful) => {
    const { statefuls } = G
    statefuls.remove(stateful)
    removeFromBlock(stateful)
    removeFromSector(stateful)
    freeStateful(stateful)
}
