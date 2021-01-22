export const buildLookupEntry = (size: number, x: number, y: number, width: number, height: number) => ({
    left: x / size,
    top: y / size,
    right: (x + width) / size,
    bottom: (y + height) / size
})
