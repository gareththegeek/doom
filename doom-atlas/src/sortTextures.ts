import { Dimensioned } from "./Dimensioned"

export const sortDimensioneds = (a: Dimensioned, b: Dimensioned): number => {
    const h = b.height - a.height
    if (h !== 0) {
        return h
    }
    return b.width - a.width
}