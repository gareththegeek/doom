import { AtlasEntry } from './AtlasEntry'
import { buildLookupEntry } from './buildLookupEntry'
import { sortDimensioneds } from './sortDimensioneds'
import { TextureAtlasLookup } from './TextureAtlas'

const MARGIN = 2

export const packEntries = <T>(
    size: number,
    entries: AtlasEntry<T>[]
): TextureAtlasLookup => {
    const sortedEntries = entries.sort(sortDimensioneds)

    let x = MARGIN
    let y = MARGIN
    let rowHeight = sortedEntries[0].height
    const lookup: TextureAtlasLookup = {}
    for (const entry of sortedEntries) {
        const { name, width, height } = entry
        if (x + width > size) {
            x = MARGIN
            y += rowHeight + MARGIN
            rowHeight = height
        }
        lookup[name] = buildLookupEntry(size, x, y, width, height)
        entry.blit(entry, x, y)
        x += width + MARGIN
    }

    return lookup
}
