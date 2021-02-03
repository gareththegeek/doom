import { Sector } from 'doom-map'
import { G } from '../../global'

export const getTaggedSectors = (tag: number): Sector[] => {
    const {
        map: { sectors }
    } = G

    if (tag === 0) {
        //HACK some triggers like exit switch don't refer to a sector so return first sector
        return [sectors[0]]
    }

    const tagged = sectors.filter((s) => s.tag === tag)
    if (tagged.length === 0) {
        console.warn(`Unable to find sector with tag ${tag}`)
    }
    return tagged
}
