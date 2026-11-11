# Indexing manifest — observed production baseline

All Google index states: **unknown (authenticated GSC unavailable)**. URLs reflect production before the proposed patch. HTTP eligibility is not a Google index verdict.

| Canonical / requested URL | Type | HTTP | Robots | In sitemap | Discovery | Google state | Manual action | Priority |
|---|---|---|---|---|---|---|---|---|
| https://www.defencepathshala.in/ | public/utility | 200 | index, follow | Yes | Public navigation / contextual links | Unknown | Monitor if already indexed; inspect if excluded | P2 |
| https://www.defencepathshala.in/robots.txt | public/utility | 200 | not established | No | Public navigation / contextual links | Unknown | Do not request indexing | P2 |
| https://www.defencepathshala.in/exams/cds | guide | 200 | index, follow | Yes | Public navigation / contextual links | Unknown | Monitor if already indexed; inspect if excluded | P2 |
| https://www.defencepathshala.in/exams/capf | guide | 200 | index, follow | Yes | Public navigation / contextual links | Unknown | Monitor if already indexed; inspect if excluded | P2 |
| https://www.defencepathshala.in/pyqs/cds | archive | 200 | index, follow | Yes | Homepage → exam archive → year/subject/topic | Unknown | Inspect after release; request only if stale/not indexed and live test passes | P1 |
| https://www.defencepathshala.in/pyqs/capf | archive | 200 | index, follow | Yes | Homepage → exam archive → year/subject/topic | Unknown | Inspect after release; request only if stale/not indexed and live test passes | P1 |
| https://www.defencepathshala.in/pyqs/cds/2026 | archive | 200 | index, follow | Yes | Homepage → exam archive → year/subject/topic | Unknown | Monitor if already indexed; inspect if excluded | P2 |
| https://www.defencepathshala.in/pyqs/capf/2026 | archive | 200 | index, follow | Yes | Homepage → exam archive → year/subject/topic | Unknown | Monitor if already indexed; inspect if excluded | P2 |
| https://www.defencepathshala.in/pyqs/cds/polity | archive | 200 | index, follow | Yes | Homepage → exam archive → year/subject/topic | Unknown | Monitor if already indexed; inspect if excluded | P2 |
| https://www.defencepathshala.in/pyqs/capf/history | archive | 200 | index, follow | Yes | Homepage → exam archive → year/subject/topic | Unknown | Monitor if already indexed; inspect if excluded | P2 |
| https://www.defencepathshala.in/pyqs/cds/history/modern-history | archive | 200 | index, follow | Yes | Homepage → exam archive → year/subject/topic | Unknown | Monitor if already indexed; inspect if excluded | P2 |
| https://www.defencepathshala.in/pyqs/cds/2026/polity | archive | 200 | index, follow | Yes | Homepage → exam archive → year/subject/topic | Unknown | Monitor if already indexed; inspect if excluded | P2 |
| https://www.defencepathshala.in/pyqs/unsupported | archive | 404 | noindex | No | Homepage → exam archive → year/subject/topic | Unknown | Do not request indexing | P2 |
| https://www.defencepathshala.in/pyqs/cds/9999 | archive | 404 | noindex | No | Homepage → exam archive → year/subject/topic | Unknown | Do not request indexing | P2 |
| https://www.defencepathshala.in/pyqs/cds/not-a-subject | archive | 404 | noindex | No | Homepage → exam archive → year/subject/topic | Unknown | Do not request indexing | P2 |
| https://www.defencepathshala.in/pyqs/cds/ | archive | 200 | index, follow | No | Homepage → exam archive → year/subject/topic | Unknown | Do not request indexing | P2 |
| https://www.defencepathshala.in/afcat | public/utility | 200 | index, follow | Yes | Public navigation / contextual links | Unknown | Monitor if already indexed; inspect if excluded | P2 |
| https://www.defencepathshala.in/about | public/utility | 200 | index, follow | Yes | Public navigation / contextual links | Unknown | Monitor if already indexed; inspect if excluded | P2 |
| https://www.defencepathshala.in/current-affairs | public/utility | 200 | index, follow | Yes | Public navigation / contextual links | Unknown | Monitor if already indexed; inspect if excluded | P2 |
| https://www.defencepathshala.in/dashboard/question-bank | app/noindex | 200 | noindex, follow | No | Public navigation / contextual links | Unknown | Do not request indexing | P2 |
| https://www.defencepathshala.in/dashboard/practice?exam=CDS | app/noindex | 200 | noindex, follow | No | Public navigation / contextual links | Unknown | Do not request indexing | P2 |
| https://www.defencepathshala.in/dashboard/practice?exam=CAPF-AC | app/noindex | 200 | noindex, follow | No | Public navigation / contextual links | Unknown | Do not request indexing | P2 |
| https://www.defencepathshala.in/api/admin/seo/search-console?action=sites | public/utility | 401 | not established | No | Public navigation / contextual links | Unknown | Do not request indexing | P2 |
| https://defencepathshala.in/pyqs/cds | archive | 200 | index, follow | No | Homepage → exam archive → year/subject/topic | Unknown | Do not request indexing | P2 |
