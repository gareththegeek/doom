import { Sector } from 'doom-map'

export const light_change_to = (sector: Sector, amount: number) => {
    sector.lightLevel = amount
}
