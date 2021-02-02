import { Sector } from 'doom-map'
import { openDoor } from '../openDoor'

export const door_open_stay = (sector: Sector) => {
    openDoor(sector)
}
