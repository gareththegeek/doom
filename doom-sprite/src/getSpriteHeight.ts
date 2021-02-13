import { S } from './global'

export const getSpriteHeight = (name: string, frame: number): number => S.lookup[name].frames[frame].height * 4096 // TODO hardcoded atlas size
