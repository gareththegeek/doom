export interface FrameInfo {
    name: string
    mirror: boolean
    index: number,
    height: number
}

export type FrameNameLookup = { [o: number]: { [a: number]: FrameInfo } }
