# NDA I 2026 ingestion

- Sources: Mathematics set D (D - NPSS-A-HMT, photo scan, sha256 7691c228a3e98526c7905804b62761b6763bb3288edfee60dfde0f758c1fdc06) and General Ability Test set A (NPSS-B-TGA/65A, 300 dpi scan, sha256 53d7df1d1ab9aa7c0f61b64184446ad9f567d5e869e0071f44b0f2a26cb1cc87). The GAT scan has inserted advert pages; no question pages are missing.
- `source/*.py`: transcription with key, explanation and taxonomy per question (`qfmt.Q`). `FLAGS` lists keys to recheck against the official UPSC provisional key (released 16 April 2026), which was not available when this was built.
- `source/build.py` writes `../nda_maths/prod_load/nda_i_2026_maths.json` and `../nda_gat/prod_load/nda_i_2026_gat.json`.
- Keys are DP-solved (`key:dp_solved`). Figures for GAT Q72-75 are in `frontend/public/pyq-figures/nda-2026-i-gat/`.
