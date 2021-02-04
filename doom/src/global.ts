import { GameState } from './interfaces/GameState'
import { Stateful, StatefulObject, StatefulObjectThing, StatefulThing } from './interfaces/State'

export const G = {
    cheats: {
        noclip: false
    },
    input: {
        isPressed: {}
    },
    statefuls: [] as Stateful[]
} as GameState

export const isStatefulThingObject = (stateful: Stateful): stateful is StatefulObjectThing =>
    isStatefulThing(stateful) && isStatefulObject(stateful)

export const isStatefulObject = (stateful: Stateful): stateful is StatefulObject => 'geometry' in stateful
export const findStatefulObjects = () => G.statefuls.filter(isStatefulObject)

export const isStatefulThing = (stateful: Stateful): stateful is StatefulThing => 'thing' in stateful
export const findStatefulThings = () => G.statefuls.filter(isStatefulThing)
