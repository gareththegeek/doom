import { AtlasEntry } from '../interfaces/AtlasEntry'
import { buildLookupEntry } from './buildLookupEntry'
import { sortDimensioneds } from './sortDimensioneds'
import { TextureAtlasLookup } from '../interfaces/TextureAtlas'

const MARGIN = 2

const blitRow = (
    image: number[],
    size: number,
    sourcex: number,
    sourcey: number,
    width: number,
    targety: number
): void => {
    for (let x = 0; x < width; x++) {
        const sourceIdx = ((sourcex + x) * size + sourcey) * 2
        const targetIdx = ((sourcex + x) * size + targety) * 2
        image[targetIdx] = image[sourceIdx]
    }
}

const blitColumn = (
    image: number[],
    size: number,
    sourcex: number,
    sourcey: number,
    height: number,
    targetx: number
): void => {
    try {
        const targetIdx = (targetx * size + sourcey) * 2
        const sourceIdx = (sourcex * size + sourcey) * 2
        image.splice(targetIdx, height, ...image.slice(sourceIdx, sourceIdx + height))
    } catch (e) {
        console.error(e.message)
        console.error(`${sourcex} ${sourcey} ${height} ${targetx}`)
    }
}

const blitFrame = (image: number[], size: number, left: number, top: number, width: number, height: number): void => {
    const bottom = top + height - 1
    const right = left + width - 1
    blitColumn(image, size, left, top, height, left - 1)
    blitColumn(image, size, right, top, height, right + 1)
    blitRow(image, size, left, top, width, top - 1)
    blitRow(image, size, left, bottom, width, bottom + 1)
}

export const packEntries = <T>(image: number[], size: number, entries: AtlasEntry<T>[]): TextureAtlasLookup => {
    const sortedEntries = entries.sort(sortDimensioneds)

    let x = MARGIN
    let y = MARGIN
    let rowHeight = sortedEntries[0].height
    const lookup: TextureAtlasLookup = {}
    for (const entry of sortedEntries) {
        const { name, width, height } = entry
        if (x + width + MARGIN > size) {
            x = MARGIN
            y += rowHeight + MARGIN
            rowHeight = height
        }
        lookup[name] = buildLookupEntry(size, x, y, width, height)
        entry.blit(entry, x, y)
        blitFrame(image, size, x, y, width, height)
        x += width + MARGIN
    }

    return lookup
}
