import { Dimensioned } from './Dimensioned'

export interface AtlasEntry<T> extends Dimensioned {
    name: string
    data: T
}
