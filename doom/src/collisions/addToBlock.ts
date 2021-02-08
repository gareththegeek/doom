import { Block } from '../interfaces/BlockMap'
import { Stateful } from '../interfaces/State'

export const addToBlock = (block: Block, stateful: Stateful): void => {
    if (block === undefined) {
        return
    }
    if (stateful === undefined) {
        return
    }

    block.statefuls.add(stateful)
    stateful.block = block
}
