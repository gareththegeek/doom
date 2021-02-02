export interface ParseLevelResult {
    e: number
    m: number
}

export const parseLevel = (name: string): ParseLevelResult | undefined => {
    const matches = name.match(/^e([1-4])m([1-9])$/)
    if (matches === null || matches.length < 3) {
        console.warn(`Unable to parse map name ${name}`)
        return undefined
    }

    return { e: parseInt(matches[1]), m: parseInt(matches[2]) }
}
