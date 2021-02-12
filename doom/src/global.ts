import { LinkedList } from 'low-mem'
import { GameState } from './interfaces/GameState'
import { Stateful } from './interfaces/State'

export const G = {
    cheats: {
        noclip: false
    },
    input: {
        isPressed: {}
    },
    statefuls: new LinkedList<Stateful>()
} as GameState
