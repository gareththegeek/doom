import { Sector } from 'doom-map'
import { cancelAction } from '../mutations/cancelAction'

export const floor_stop_moving = (sector: Sector) => {
    cancelAction(sector)
}
