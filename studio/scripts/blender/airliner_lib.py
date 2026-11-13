"""Procedural generic twin-engine airliner, built with bpy.
Shared by build_airliner.py (GLB export for Three.js) and engine_shot.py.
Units: metres. Blender axes: +X nose, +Y left wing, +Z up. Generic livery,
no airline marks. Same operations Blender MCP would issue via execute_code."""
import bpy, bmesh, math
from mathutils import Vector

def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def mat(name, rgb, rough=0.4, metal=0.0, emit=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*rgb, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if emit:
        b.inputs["Emission Color"].default_value = (*emit[0], 1); b.inputs["Emission Strength"].default_value = emit[1]
    return m

def srgb(h):
    h = h.lstrip("#"); c = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)

def obj_from_bm(bm, name, material, smooth=True):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    if smooth:
        for p in me.polygons: p.use_smooth = True
    ob = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(ob)
    ob.data.materials.append(material)
    return ob

def loft(sections, name, material, cap=True, smooth=True):
    """sections: list of rings (list of Vector), equal length, closed."""
    bm = bmesh.new(); rings = [[bm.verts.new(v) for v in ring] for ring in sections]
    n = len(sections[0])
    for a, b in zip(rings[:-1], rings[1:]):
        for i in range(n):
            bm.faces.new((a[i], a[(i+1) % n], b[(i+1) % n], b[i]))
    if cap:
        bm.faces.new(list(reversed(rings[0]))); bm.faces.new(rings[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return obj_from_bm(bm, name, material, smooth)

def fuselage(material, seg=56):
    L0, L1, R = -19.0, 18.5, 2.0
    secs = []
    N = 70
    for k in range(N + 1):
        t = k / N; x = L0 + (L1 - L0) * t
        if x > 13.0:   # nose: elliptic taper
            u = (x - 13.0) / (L1 - 13.0); r = R * math.sqrt(max(1 - u ** 2.2, 0.0004)); zc = -0.35 * u
        elif x < -9.0:  # tail cone: taper with upsweep
            u = (-9.0 - x) / (-9.0 - L0); r = R * (1 - 0.86 * u ** 1.25); zc = 1.25 * u ** 1.4
        else:
            r, zc = R, 0.0
        ring = [Vector((x, r * math.cos(2 * math.pi * i / seg), zc + r * 1.04 * math.sin(2 * math.pi * i / seg))) for i in range(seg)]
        secs.append(ring)
    return loft(secs, "Fuselage", material)

def airfoil(chord, thick, n=24):
    pts = []
    for i in range(n):
        th = 2 * math.pi * i / n; xc = 0.5 * (1 + math.cos(th))  # 1..0..1
        yt = 5 * thick * (0.2969 * math.sqrt(xc) - 0.126 * xc - 0.3516 * xc**2 + 0.2843 * xc**3 - 0.1036 * xc**4)
        pts.append((xc * chord, yt if th < math.pi else -yt))
    return pts

def wing(name, material, root_le, root_c, tip_c, span, sweep_deg, dihedral_deg, thick, side=1, vertical=False, nsec=6):
    secs = []
    for k in range(nsec + 1):
        t = k / nsec; c = root_c + (tip_c - root_c) * t; s = span * t
        le_x = root_le[0] - s * math.tan(math.radians(sweep_deg))
        prof = airfoil(c, thick * (1 - 0.3 * t))
        ring = []
        for (px, pz) in prof:
            x = le_x - px
            if vertical:
                ring.append(Vector((x, pz, root_le[2] + s)))
            else:
                y = root_le[1] + side * s; z = root_le[2] + s * math.tan(math.radians(dihedral_deg)) + pz
                ring.append(Vector((x, y, z)))
        if side < 0 and not vertical: ring.reverse()
        secs.append(ring)
    return loft(secs, name, material)

def nacelle(name, m_shell, m_inlet, m_core, center, length=4.4, r=1.05):
    cx, cy, cz = center; seg = 48; secs = []
    prof = [(0.0, 0.86), (0.05, 0.97), (0.18, 1.0), (0.55, 0.98), (0.85, 0.86), (1.0, 0.78)]
    for (u, rr) in prof:
        x = cx + length * 0.5 - u * length
        secs.append([Vector((x, cy + r * rr * math.cos(2*math.pi*i/seg), cz + r * rr * math.sin(2*math.pi*i/seg))) for i in range(seg)])
    shell = loft(secs, name + "_shell", m_shell, cap=False)
    # inlet face (dark) and core nozzle + plug
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=r*0.84, depth=0.05, location=(cx + length*0.5 - 0.25, cy, cz), rotation=(0, math.pi/2, 0))
    inlet = bpy.context.active_object; inlet.name = name + "_inlet"; inlet.data.materials.append(m_inlet)
    bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=r*0.55, radius2=r*0.38, depth=1.1, location=(cx - length*0.5 - 0.45, cy, cz), rotation=(0, -math.pi/2, 0))
    core = bpy.context.active_object; core.name = name + "_core"; core.data.materials.append(m_core)
    bpy.ops.mesh.primitive_cone_add(vertices=32, radius1=r*0.3, radius2=0.02, depth=1.0, location=(cx - length*0.5 - 1.3, cy, cz), rotation=(0, -math.pi/2, 0))
    plug = bpy.context.active_object; plug.name = name + "_plug"; plug.data.materials.append(m_core)
    for o in (inlet, core, plug):
        for p in o.data.polygons: p.use_smooth = True
    return [shell, inlet, core, plug]

def build_airliner(livery_tail="#0B1A3A", stripe="#2563EB"):
    white = mat("Paint_White", srgb("#F4F6FA"), 0.32)
    grey = mat("Wing_Grey", srgb("#B8C0CC"), 0.45, 0.25)
    nac = mat("Nacelle", srgb("#DDE2EA"), 0.3, 0.35)
    dark = mat("Inlet_Dark", srgb("#14171C"), 0.6, 0.6)
    core = mat("Core_Metal", srgb("#5A606A"), 0.35, 0.9)
    tail = mat("Tail_Navy", srgb(livery_tail), 0.35)
    glass = mat("Cockpit_Glass", srgb("#0A1220"), 0.08, 0.2)
    parts = [fuselage(white)]
    for side in (1, -1):
        parts.append(wing(f"Wing_{side}", grey, (3.6, side * 1.6, -1.15), 6.4, 1.7, 15.5, 26, 5.5, 0.13, side))
        parts.append(wing(f"Stab_{side}", grey, (-13.4, side * 0.5, 0.9), 3.6, 1.2, 6.0, 30, 6, 0.10, side))
        # winglet
        parts.append(wing(f"Winglet_{side}", tail, (3.6 - 15.5 * math.tan(math.radians(26)) - 0.2, side * 17.0, -1.15 + 15.5 * math.tan(math.radians(5.5))), 1.6, 0.6, 2.2, 35, 0, 0.08, side, vertical=True, nsec=3))
        y = side * 5.9
        parts += nacelle(f"Engine_{side}", nac, dark, core, (5.9, y, -2.45))
        bpy.ops.mesh.primitive_cube_add(size=1, location=(4.2, y, -1.5)); py = bpy.context.active_object
        py.scale = (3.4, 0.28, 0.9); py.name = f"Pylon_{side}"; py.data.materials.append(grey); parts.append(py)
    parts.append(wing("Fin", tail, (-11.2, 0, 1.6), 6.2, 2.2, 6.6, 36, 0, 0.11, 1, vertical=True))
    # cockpit window band
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=1, location=(16.4, 0, 0.55))
    ck = bpy.context.active_object; ck.scale = (1.35, 1.55, 0.42); ck.name = "Cockpit"; ck.data.materials.append(glass); parts.append(ck)
    for o in parts:
        o.select_set(True)
    return parts
