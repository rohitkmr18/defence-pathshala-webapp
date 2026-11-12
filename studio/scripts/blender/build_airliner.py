"""usage: /home/user/bpyenv/bin/python scripts/blender/build_airliner.py public/models/airliner.glb"""
import sys, os, bpy
sys.path.insert(0, os.path.dirname(__file__))
from airliner_lib import clear_scene, build_airliner
out = sys.argv[-1]
clear_scene(); build_airliner()
bpy.ops.export_scene.gltf(filepath=os.path.abspath(out), export_format="GLB", use_selection=False, export_apply=True)
print("exported", out, len(bpy.data.objects), "objects")
