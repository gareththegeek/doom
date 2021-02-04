import { Sector } from '../../interfaces/Sector'
import { mutationPromise, SectorUpdateResolve } from './mutationPromise'

export const moveCeiling = async (sector: Sector, targetHeight: number, moveSpeed: number): Promise<boolean> =>
    mutationPromise(
        sector,
        (() => {
            const target = targetHeight
            const speed = moveSpeed

            return (resolve: SectorUpdateResolve, deltaTime: number) => {
                sector.ceilingHeight += speed * deltaTime
                
                const finishedLowering = speed < 0 && sector.ceilingHeight <= target
                const finishedRaising = speed > 0 && sector.ceilingHeight >= target
                const finished = finishedLowering || finishedRaising

                if (finished) {
                    sector.ceilingHeight = target
                    resolve(false)
                }
            }
        })()
    )
