import { Sector } from '../../interfaces/Sector'
import { mutationPromise, SectorUpdateResolve } from './mutationPromise'

export const wait = async (sector: Sector, time: number): Promise<boolean> =>
    mutationPromise(
        sector,
        (() => {
            let count = 0
            let target = time

            return (resolve: SectorUpdateResolve, deltaTime: number) => {
                count += deltaTime
                if (count >= target) {
                    resolve(false)
                }
            }
        })()
    )
