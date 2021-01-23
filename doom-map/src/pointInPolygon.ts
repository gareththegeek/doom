import { vec2 } from 'gl-matrix'

export const pointInPolygon = (point: vec2, vs: vec2[]) => {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    var x = point[0],
        y = point[1]

    var inside = false
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0],
            yi = vs[i][1]
        var xj = vs[j][0],
            yj = vs[j][1]

        var intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
        if (intersect) {
            inside = !inside
        }
    }

    return inside
}
