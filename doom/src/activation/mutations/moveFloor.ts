import { Sector } from '../../interfaces/Sector'
import { mutationPromise, SectorUpdateResolve } from './mutationPromise'

export const moveFloor = async (sector: Sector, targetHeight: number, moveSpeed: number): Promise<boolean> =>
    mutationPromise(
        sector,
        (() => {
            const target = targetHeight
            const speed = moveSpeed

            return (resolve: SectorUpdateResolve, deltaTime: number) => {
                sector.floorHeight += speed * deltaTime

                const finishedLowering = speed < 0 && sector.floorHeight <= target
                const finishedRaising = speed > 0 && sector.floorHeight >= target
                const finished = finishedLowering || finishedRaising

                if (finished) {
                    sector.floorHeight = target
                    resolve(false)
                }
            }
        })()
    )
