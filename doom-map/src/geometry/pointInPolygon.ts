import { vec2 } from 'gl-matrix'

export const pointInPolygon = (point: vec2, vs: vec2[], includeBoundary = false) => {
    const x = point[0]
    const y = point[1]
    
    let intersections = 0
    let ss = 0

    let j = vs.length - 1
    for (let i = 0; i < vs.length; i++) {
        j = (i + vs.length - 1) % vs.length

        let xi = vs[i][0]
        let yi = vs[i][1]
        let xj = vs[j][0]
        let yj = vs[j][1]

        if (yj === yi && yj === y && x > Math.min(xj, xi) && x < Math.max(xj, xi)) {
            // Check if point is on an horizontal polygon boundary
            return includeBoundary
        }

        if (y > Math.min(yj, yi) && y <= Math.max(yj, yi) && x <= Math.max(xj, xi) && yj !== yi) {
            ss = ((y - yj) * (xi - xj)) / (yi - yj) + xj

            if (ss === x) {
                // Check if point is on the polygon boundary (other than horizontal)

                return includeBoundary
            }

            if (xj === xi || x <= ss) {
                intersections++
            }
        }
    }

    // If the number of edges we passed through is odd, then it’s in the polygon.

    if (intersections % 2 != 0) {
        return true
    } else {
        return false
    }
}
