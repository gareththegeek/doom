import { Sector } from '../../interfaces/Sector'

export type SectorUpdateResolve = (value: boolean | Promise<boolean>) => void
export type AsyncSectorUpdateFunction = (resolve: SectorUpdateResolve, deltaTime: number) => void

export const mutationPromise = async (sector: Sector, wrapped: AsyncSectorUpdateFunction): Promise<boolean> =>
    new Promise((resolve) => {
        sector.update = {
            cancel: false,
            function: (() => {
                return (deltaTime: number) => {
                    if (sector.update!.cancel) {
                        sector.update = undefined
                        resolve(true)
                        return
                    }

                    return wrapped(resolve, deltaTime)
                }
            })()
        }
    })
