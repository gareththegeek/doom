export interface FrameInfo {
    name: string
    mirror: boolean
    index: number
}

export type FrameNameLookup = { [o: number]: { [a: number]: FrameInfo } }
