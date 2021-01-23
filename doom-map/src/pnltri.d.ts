declare module 'pnltri' {
    export interface Point {
        x: number,
        y: number
    }

    export type Line = Point[]

    export type IndexedFace = [a: number, b: number, c: number]

    export class Triangulator {
        public triangulate_polygon(data: [contour: Line, ...holes: Line[]]): IndexedFace[]
    }
}
