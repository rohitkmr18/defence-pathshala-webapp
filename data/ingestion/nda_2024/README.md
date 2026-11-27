# NDA 2024 (I and II) — Mathematics and GAT

Hand transcription of the English side of the scanned question booklets (set A for all four papers:
II = SURN-B-MTH/81A, SURN-A-GAT; I = RRAN-B-MTH, RRAN-A-GAT), built into prod-load JSON by `source/build2024.py`.

- Keys are DP-solved (`key:dp_solved`, `official_opt` null). Items needing a second look are listed under `flags` in each JSON.
- Withheld (inactive, `content_status = WITHHELD`):
  - NDA_II_2024_MATHS_026 — true solution count is 4; options are 1 / 2 / 5 / more than 5.
  - NDA_II_2024_GK_123 — friction works out to 5 N, which is not an option.
  - NDA_I_2024_MATHS_066 — as printed (αi − βj + γk) the sum is 0, not an option.
  - NDA_I_2024_MATHS_106 — statements 1 and 2 are both true; the code has no "1 and 2 only".
- Figures: NDA II 2024 GAT Q64, 67, 69-72 use images in `frontend/public/pyq-figures/nda-2024-ii-gat/` (loaded inactive, activated after deploy).
  NDA I 2024 GAT figure items (Q51, 52, 54, 56, 89, 124, 126, 128) carry text descriptions of the diagram instead of images.
- Outputs: `nda_maths/prod_load/nda_{i,ii}_2024_maths.json`, `nda_gat/prod_load/nda_{i,ii}_2024_gat.json`.
