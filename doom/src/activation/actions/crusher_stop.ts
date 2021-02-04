import { Sector } from '../../interfaces/Sector'
import { cancelAction } from '../mutations/cancelAction'

export const crusher_stop = (sector: Sector) => {
    cancelAction(sector)
}
