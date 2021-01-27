const Buffer = require('buffer/').Buffer
import { readWad } from '.'
import { Wad } from '../interfaces/Wad'

export const fetchWad = async (url: string): Promise<Wad> => {
    const response = await fetch(url)
    const blob = await response.blob()
    const array = await new Response(blob).arrayBuffer()
    const buffer = Buffer.from(array)
    return readWad(buffer)
}
