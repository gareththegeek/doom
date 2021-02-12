import { Block } from '../interfaces/BlockMap'
import { Physics } from '../interfaces/State'

export const addToBlock = (block: Block, stateful: Physics): void => {
    if (block === undefined) {
        return
    }
    if (stateful === undefined) {
        return
    }

    block.statefuls.add(stateful)
    stateful.block = block
}
