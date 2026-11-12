# Defence Pathshala Reel Studio

Isolated scaffold for an AI-assisted, narration-led educational reel pipeline. This package is **not integrated into the production webapp or Vercel deployment**.

## Getting started with Claude Code

1. Check out `feature/dp-reel-studio-scaffold` in the Defence Pathshala repository.
2. Open the repository root in Claude Code. Ask it to work only within `studio/`.
3. Run `cd studio && npm run studio:info` to check the scaffold.
4. Review `projects/contrails/script.md`, `projects/contrails/storyboard.json`, and `projects/contrails/sources.md`.
5. Evaluate [Three.js](https://github.com/mrdoob/three.js), [Blender MCP](https://github.com/ahujasid/mcp-for-blender), [React Postprocessing](https://github.com/pmndrs/react-postprocessing), and [Video Shotcraft](https://github.com/Vincentwei1021/video-shotcraft). Remotion and video-talkcraft may also be evaluated. These tools are **not installed yet**.
6. After verifying compatibility, implement a deterministic five-second render proof of concept before producing a full reel.

## Guardrails

- No changes to `frontend/`, `backend/`, root scripts, Supabase, authentication, SEO or CI.
- Use a separate feature branch; do not merge or deploy without explicit approval.
- Generated videos, bulky assets and temporary outputs are git-ignored.
- Add only verified, appropriately licensed footage and assets.
- Use the **actual approved DP logo** for final renders; no substitute artwork.
- No generated or recorded audio is included with this scaffold.

## Directories

- `src/compositions` — Remotion compositions
- `src/scenes` — sequence-specific visuals, including optional Three.js
- `src/components` — reusable title cards, captions, transitions
- `src/branding` — shared brand tokens and overlays
- `assets` — local licensed footage, models, audio and official logo
- `scripts` — local tooling
- `projects/contrails` — editorial source and shot instructions
- `renders` — local-only output; automatically created during rendering

Git does not preserve empty directories. The `.gitkeep` files establish those paths.
