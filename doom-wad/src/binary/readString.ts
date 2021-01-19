export const readString = (data: Buffer, start: number, end: number): string =>
    data.toString('ascii', start, end).replace(/\0/g, '')
