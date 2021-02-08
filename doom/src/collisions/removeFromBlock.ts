import { Stateful } from '../interfaces/State'

export const removeFromBlock = (stateful: Stateful): void => {
    if (stateful.block === undefined) {
        return
    }

    stateful.block.statefuls.remove(stateful)
    stateful.block = undefined
}
