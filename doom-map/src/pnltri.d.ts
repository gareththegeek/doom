declare module 'pnltri' {
    export interface Point {
        x: number,
        y: number
    }

    export class Triangulator {
        public triangulate_polygon(data: Point[][]): any
    }
}
