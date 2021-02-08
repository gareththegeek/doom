import { Stateful } from '../interfaces/State'

export const removeFromBlock = (stateful: Stateful): void => {
    if (stateful.block === undefined) {
        return
    }

    stateful.block.statefuls.splice(stateful.block.statefuls.indexOf(stateful), 1)
    stateful.block = undefined
}
