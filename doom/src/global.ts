import { forEachLinkedList, LinkedList } from 'low-mem'
import { GameState } from './interfaces/GameState'
import { Stateful, StatefulObject, StatefulObjectThing, StatefulThing } from './interfaces/State'

export const G = {
    cheats: {
        noclip: false
    },
    input: {
        isPressed: {}
    },
    statefuls: new LinkedList<Stateful>()
} as GameState

export const isStatefulObjectThing = (stateful: Stateful): stateful is StatefulObjectThing =>
    isStatefulThing(stateful) && isStatefulObject(stateful)

let statefulObjectThingCallback: (stateful: StatefulObjectThing) => void
const callbackStatefulObjectThings = (stateful: Stateful): void => {
    if (isStatefulObjectThing(stateful)) {
        statefulObjectThingCallback(stateful)
    }
}
export const forEachStatefulObjectThing = (callback: (stateful: StatefulObjectThing) => void): void => {
    statefulObjectThingCallback = callback
    forEachLinkedList(G.statefuls, callbackStatefulObjectThings)
}

export const isStatefulObject = (stateful: Stateful): stateful is StatefulObject => 'geometry' in stateful

let statefulObjectCallback: (stateful: StatefulObject) => void
const callbackStatefulObjects = (stateful: Stateful): void => {
    if (isStatefulObject(stateful)) {
        statefulObjectCallback(stateful)
    }
}
export const forEachStatefulObject = (callback: (stateful: StatefulObject) => void): void => {
    statefulObjectCallback = callback
    forEachLinkedList(G.statefuls, callbackStatefulObjects)
}

export const isStatefulThing = (stateful: Stateful): stateful is StatefulThing => 'thing' in stateful

let statefulThingCallback: (stateful: StatefulThing) => void
const callbackStatefulThings = (stateful: Stateful): void => {
    if (isStatefulThing(stateful)) {
        statefulThingCallback(stateful)
    }
}
export const forEachStatefulThing = (callback: (stateful: StatefulThing) => void): void => {
    statefulThingCallback = callback
    forEachLinkedList(G.statefuls, callbackStatefulThings)
}
