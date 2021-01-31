import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { M } from './global'

export const initialiseMapSystem = (wad: Wad, atlas: TextureAtlas): void => {
    M.wad = wad
    M.atlas = atlas
}
