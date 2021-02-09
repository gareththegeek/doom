import { ReadonlyVec2, vec2 } from 'gl-matrix'

let v = vec2.create()
let u = vec2.create()
let projuonv = vec2.create()

export const projectPositionOntoLine = (
    pout: vec2,
    position: ReadonlyVec2,
    start: ReadonlyVec2,
    end: ReadonlyVec2
): void => {
    //v_norm = np.sqrt(sum(v**2))
    //proj_of_u_on_v = (np.dot(u, v)/v_norm**2)*v

    vec2.subtract(v, end, start)
    vec2.subtract(u, position, start)

    const vmag = vec2.sqrLen(v)
    vec2.scale(projuonv, v, vec2.dot(u, v) / vmag)
    vec2.add(pout, start, projuonv)
}
