export const readBytes = (data: Buffer, start: number, length: number) =>
    Array.from(Uint8Array.from(data.slice(start, start + length)))
