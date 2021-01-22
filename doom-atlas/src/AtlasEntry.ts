import { Dimensioned } from './Dimensioned'

export type BlitFunction<T> = (entry: AtlasEntry<T>, x: number, y: number) => void

export interface AtlasEntry<T> extends Dimensioned {
    name: string
    data: T
    blit: BlitFunction<T>
}
