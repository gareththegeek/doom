import { Physics } from '../interfaces/State'

export const removeFromBlock = (stateful: Physics): void => {
    if (stateful.block === undefined) {
        return
    }

    stateful.block.statefuls.remove(stateful)
    stateful.block = undefined
}
