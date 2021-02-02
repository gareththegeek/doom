import { Thing } from 'doom-map'

export interface Player {
    thing: Thing
    keys: {
        blue: boolean
        red: boolean
        yellow: boolean
    }
}
