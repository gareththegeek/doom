import { vec2 } from 'gl-matrix'

export const projectPositionOntoLine = (position: vec2, start: vec2, end: vec2): vec2 => {
    //v_norm = np.sqrt(sum(v**2))
    //proj_of_u_on_v = (np.dot(u, v)/v_norm**2)*v

    const v = vec2.subtract(vec2.create(), end, start)
    const u = vec2.subtract(vec2.create(), position, start)

    const vmag = vec2.sqrLen(v)
    const projuonv = vec2.scale(vec2.create(), v, vec2.dot(u, v) / vmag)
    return vec2.add(vec2.create(), start, projuonv)
}
