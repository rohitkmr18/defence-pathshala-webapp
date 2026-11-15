"""Cinematic turbofan close-up (Cycles, CPU) + per-frame camera export.
usage: python engine_shot.py <out_dir> <first> <last> [samples]
Writes <out_dir>/engine_####.png (RGBA, transparent sky) and
<out_dir>/engine_camera.json (Three.js Y-up camera per frame, nozzle point)."""
import sys, os, json, math, bpy
from mathutils import Vector, Matrix
sys.path.insert(0, os.path.dirname(__file__))
from airliner_lib import clear_scene, mat, srgb, loft, wing

out, f0, f1 = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); samples = int(sys.argv[4]) if len(sys.argv) > 4 else 20
W, H, FPS, N = 1080, 1920, 30, 180
SCALE = float(os.environ.get("PREVIEW_SCALE", "1"))
os.makedirs(out, exist_ok=True)
clear_scene(); sc = bpy.context.scene

shell_m = mat("Nacelle", srgb("#E3E8EF"), 0.22, 0.45)
lip_m = mat("Lip", srgb("#C9CED6"), 0.15, 1.0)
dark_m = mat("Duct", srgb("#0E1116"), 0.55, 0.3)
blade_m = mat("Blade", srgb("#8A939F"), 0.25, 1.0)
core_m = mat("Core", srgb("#6B717B"), 0.3, 0.95)
hot_m = mat("HotNozzle", srgb("#3A3433"), 0.45, 0.9)
wing_m = mat("Wing", srgb("#C3CAD4"), 0.4, 0.3)
spin_m = mat("Spinner", srgb("#20242B"), 0.3, 0.8)

R, L = 1.25, 5.0   # nacelle radius / length; axis along X, inlet at +X
seg = 72
def ring(x, r, zc=0.0): return [Vector((x, r * math.cos(2*math.pi*i/seg), zc + r * math.sin(2*math.pi*i/seg))) for i in range(seg)]
# outer shell -> lip -> inner duct (one continuous loft, open ends)
prof_out = [(L/2+0.02, 0.90), (L/2-0.06, 0.985), (L/2-0.4, 1.0), (0.0, 0.985), (-L/2+0.6, 0.90), (-L/2, 0.82)]
prof_in = [(-L/2+0.02, 0.79), (L/2-0.5, 0.86), (L/2-0.02, 0.88)]
loft([ring(x, R*r) for x, r in prof_out], "NacelleOuter", shell_m, cap=False)
loft([ring(x, R*r) for x, r in prof_in], "NacelleInner", dark_m, cap=False)
bpy.ops.mesh.primitive_torus_add(major_radius=R*0.89, minor_radius=0.07, major_segments=96, minor_segments=16, location=(L/2, 0, 0), rotation=(0, math.pi/2, 0))
bpy.context.active_object.data.materials.append(lip_m)
# fan: spinner + twisted blades, parented to an empty that spins
bpy.ops.object.empty_add(location=(L/2-0.75, 0, 0)); fan = bpy.context.active_object; fan.name = "Fan"
bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=0.42, radius2=0.0, depth=0.9, location=(L/2-0.45, 0, 0), rotation=(0, math.pi/2, 0))
sp = bpy.context.active_object; sp.data.materials.append(spin_m); sp.parent = fan; sp.matrix_parent_inverse = fan.matrix_world.inverted()
for b in range(22):
    a = 2*math.pi*b/22
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0)); bl = bpy.context.active_object
    bl.scale = (0.32, 0.03, R*0.42); bl.data.materials.append(blade_m)
    bl.location = (L/2-0.75, math.cos(a)*R*0.62, math.sin(a)*R*0.62)
    bl.rotation_euler = (a - math.pi/2, 0, 0); bl.rotation_mode = "XYZ"
    bl.rotation_euler.rotate(Matrix.Rotation(math.radians(38), 3, Vector((0, math.cos(a), math.sin(a)))).to_euler())
    bl.parent = fan; bl.matrix_parent_inverse = fan.matrix_world.inverted()
# core cowl, hot nozzle and plug behind the bypass exit
loft([ring(-L/2+0.4, 0.86), ring(-L/2-0.6, 0.74), ring(-L/2-1.5, 0.56)], "CoreCowl", core_m, cap=False)
loft([ring(-L/2-1.5, 0.56), ring(-L/2-1.62, 0.53)], "HotNozzle", hot_m, cap=False)
loft([ring(-L/2-1.0, 0.36), ring(-L/2-1.9, 0.30), ring(-L/2-2.6, 0.12), ring(-L/2-2.85, 0.01)], "Plug", core_m)
loft([ring(-L/2-1.5, 0.555), ring(-L/2-1.5, 0.37)], "CoreDuct", dark_m, cap=False)
# pylon + wing section above
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.2, 0, R+0.32)); py = bpy.context.active_object; py.scale = (4.4, 0.26, 0.7); py.data.materials.append(wing_m)
bpy.ops.object.modifier_add(type="BEVEL"); py.modifiers[-1].width = 0.12; py.modifiers[-1].segments = 3
for side in (1, -1):
    wing(f"WingSection_{side}", wing_m, (1.6, 0.0, R+0.85), 7.6, 5.0, 16.0, 26, 5.5, 0.11, side, nsec=4)
for o in bpy.data.objects:
    if o.type == "MESH":
        for p in o.data.polygons: p.use_smooth = True

# lighting: high-altitude sun + blue sky dome (sky itself transparent in film)
w = bpy.data.worlds.new("Sky"); sc.world = w; w.use_nodes = True
bg = w.node_tree.nodes["Background"]; bg.inputs[0].default_value = (0.20, 0.38, 0.85, 1); bg.inputs[1].default_value = 0.9
bpy.ops.object.light_add(type="SUN", rotation=(math.radians(35), math.radians(-20), math.radians(140)))
sun = bpy.context.active_object; sun.data.energy = 5.5; sun.data.angle = math.radians(0.6)
bpy.ops.object.light_add(type="AREA", location=(-8, -6, -5)); fill = bpy.context.active_object
fill.data.energy = 1200; fill.data.size = 8; fill.data.color = (0.7, 0.8, 1.0)
fill.rotation_euler = (Vector((0, 0, 0)) - fill.location).to_track_quat("-Z", "Y").to_euler()

sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = samples
sc.cycles.use_denoising = True; sc.cycles.max_bounces = 6
sc.render.film_transparent = True
sc.render.resolution_x, sc.render.resolution_y = int(W*SCALE), int(H*SCALE)
sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_mode = "RGBA"
sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - Medium High Contrast"

bpy.ops.object.camera_add(); cam = bpy.context.active_object; sc.camera = cam
cam.data.lens = 24; cam.data.sensor_fit = "VERTICAL"; cam.data.sensor_height = 24; cam.data.sensor_width = 24 * W / H

def ease(t): return t * t * (3 - 2 * t)
ROLL = math.radians(-32)
def cam_at(f):
    """near engine level from the side, rolled so the exhaust runs diagonally
    down-left through open sky; slow push + drift toward the rear."""
    t = ease(f / (N - 1))
    pos = Vector((-4.0 - 2.0 * t, -21.0 + 3.0 * t, -1.2 + 0.2 * t))
    tgt = Vector((-6.2 - 1.0 * t, 0.0, -3.4))
    return pos, tgt
def cam_rot(pos, tgt):
    q = (tgt - pos).to_track_quat("-Z", "Y")
    return q @ Matrix.Rotation(ROLL, 4, "Z").to_quaternion()
def to_three(v): return [v.x, v.z, -v.y]

frames = []
for f in range(N):
    pos, tgt = cam_at(f)
    up = cam_rot(pos, tgt) @ Vector((0, 1, 0))
    frames.append({"f": f, "pos": to_three(pos), "target": to_three(tgt), "up": to_three(up)})
meta = {"fps": FPS, "frames": N, "fovY": math.degrees(2 * math.atan(12 / cam.data.lens)), "width": W, "height": H,
        "nozzle": to_three(Vector((-L/2-1.62, 0, 0))), "bypassExit": to_three(Vector((-L/2, 0, 0))),
        "bypassRadius": R*0.82, "coreRadius": 0.53, "axis": [-1, 0, 0], "camera": frames}
json.dump(meta, open(os.path.join(out, "engine_camera.json"), "w"))

for f in range(f0, f1 + 1):
    pos, tgt = cam_at(f)
    cam.location = pos; cam.rotation_euler = cam_rot(pos, tgt).to_euler()
    fan.rotation_euler = (math.radians(7.3 * f), 0, 0)
    sc.frame_set(f)
    sc.render.filepath = os.path.join(out, f"engine_{f:04d}.png")
    bpy.ops.render.render(write_still=True)
print("done", f0, f1)
