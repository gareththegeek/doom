export type WadIdentification = 'IWAD' | 'PWAD'

export interface WadHeader {
    identification: WadIdentification
    numlumps: number
    infotableofs: number
}
