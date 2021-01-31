import { Line, Sector } from 'doom-map'

export type ActivateHandler = (line: Line) => void
export const ActivateLookup: { [special: number]: ActivateHandler } = {}

export const activate = (line: Line): void => {
    console.log(`Activated line ${line.index} with special type ${line.special} and sector tag ${line.sectorTag}`)
    const handler = ActivateLookup[line.special]
    if (handler !== undefined) {
        handler(line)
    }
}
