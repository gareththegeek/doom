import { G } from '../global'
import { Stateful } from '../interfaces/State'

export const addStateful = (stateful: Stateful) => {
    const { statefuls } = G
    statefuls.add(stateful)
}
