import { AtlasEntry } from '../interfaces/AtlasEntry'
import { buildLookupEntry } from './buildLookupEntry'
import { sortDimensioneds } from './sortDimensioneds'
import { TextureAtlasEntry, TextureAtlasLookup } from '../interfaces/TextureAtlas'
import { IndexedPixel } from 'doom-wad/dist/interfaces/WadPictureLump'
import { lookup } from 'dns'

const MARGIN = 2

const blitRow = (image: IndexedPixel[][], sourcex: number, sourcey: number, width: number, targety: number): void => {
    for (let x = 0; x < width; x++) {
        image[sourcex + x][targety] = image[sourcex + x][sourcey]
    }
}

const blitColumn = (
    image: IndexedPixel[][],
    sourcex: number,
    sourcey: number,
    height: number,
    targetx: number
): void => {
    try {
        image[targetx].splice(sourcey, height, ...image[sourcex].slice(sourcey, sourcey + height))
    } catch (e) {
        console.log(e.message)
        console.log(`${sourcex} ${sourcey} ${height} ${targetx}`)
    }
}

const blitFrame = (image: IndexedPixel[][], left: number, top: number, width: number, height: number): void => {
    const bottom = top + height - 1
    const right = left + width - 1
    blitColumn(image, left, top, height, left - 1)
    blitColumn(image, right, top, height, right + 1)
    blitRow(image, left, top, width, top - 1)
    blitRow(image, left, bottom, width, bottom + 1)
}

export const packEntries = <T>(image: IndexedPixel[][], size: number, entries: AtlasEntry<T>[]): TextureAtlasLookup => {
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
        blitFrame(image, x, y, width, height)
        x += width + MARGIN
    }

    return lookup
}
