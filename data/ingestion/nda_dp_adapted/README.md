# NDA items adapted by DP (2026-11-27)

Eight NDA questions that were withheld for source defects were minimally reworded so each has exactly one
correct answer, approved by the founder, and made live. Each carries the tag `edit:dp_adapted`,
`source_version = dp-adapted-v1`, `content_version = 2`, and an "Adapted by DP" line in its explanation.

| Question | Change |
|---|---|
| NDA_II_2026_MATHS_106 | P(A∩B) 1/2 → 1/4 (k = 1/2, b) |
| NDA_II_2025_GK_085 | option (b) "a Chola king" → "a Chera king" (b) |
| NDA_II_2025_MATHS_021 / 022 | shared setup: equation x² + Lx − 2L² = 0 with β > 0 (Q21 b, Q22 c) |
| NDA_I_2024_MATHS_066 | −βĵ → +βĵ (sum 8, a) |
| NDA_I_2024_MATHS_106 | option (b) "2 only" → "1 and 2 only" (b) |
| NDA_II_2024_GK_123 | distance 20 m → 10 m (10 N, a) |
| NDA_II_2024_MATHS_026 | option (b) "Only two" → "Only four" (b) |

`fixes.py` holds the exact text; `apply.py` patched the prod_load JSON. The transcription sources (`*.py` per paper)
still hold the printed wording, so re-running a year's build script would revert these: re-apply `apply.py` afterwards.
