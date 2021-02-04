import { StatefulObject, StatefulThing } from './State'

export interface PlayerState {
    keys: {
        blue: boolean
        red: boolean
        yellow: boolean
    }
}

export interface Player extends StatefulThing, StatefulObject {
    playerState: PlayerState
}
