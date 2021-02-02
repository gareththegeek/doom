import { Sector } from 'doom-map'
import { cancelAction } from '../mutations/cancelAction'

export const crusher_stop = (sector: Sector) => {
    cancelAction(sector)
}
