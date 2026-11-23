# Maps — swap in the official outline

`src/regions.tsx` currently holds **schematic placeholder shapes**, not real geography.

1. Download the official outline from Survey of India (surveyofindia.gov.in) or the MEA
   and keep the source URL + date in `docs/reels/kashmir-three-countries/script.md`.
2. Open it in Inkscape/Figma, split it into four paths: `india`, `pok`, `aksai`, `shaksgam`,
   and export each as a path in a 1000×1000 viewBox.
3. Paste each path's `d` into `REGION_PATHS` (same ids), `LOC_PATH` for the LoC, and
   re-place `PLACES` markers.
4. Do not alter boundaries. Simplifying/clean-up of lines is fine; moving them is not.
