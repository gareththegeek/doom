import { Sector } from 'doom-map'
import { openDoor } from '../openDoor'

export const door_open_stay = (sector: Sector, amount: number) => {
    openDoor(sector)
}
