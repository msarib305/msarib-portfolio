# Resume Followup

Audit findings from Phase 18 (2026-06-06). Items marked FIXED have been resolved in this phase. Items marked PENDING require manual or external action.

---

## Audit: public/resume.pdf

| Item | Finding | Status |
|------|---------|--------|
| File size | 76 KB — well under 500 KB threshold | PASS |
| GitHub link | ABSENT — correct. Perforce is the games industry VCS standard. GitHub presence on a UE5 portfolio reads as junior/web-dev background. | PASS |
| LinkedIn link | `linkedin.com/in/msarib` present | PASS |
| YouTube links | `@msarib305` channel + 7 individual project video links present | PASS |
| Portfolio link | `msarib.dev` present | PASS |
| Other project links | `samuraisaga.com`, `fortnite.com/@exarta` present | PASS |
| Creation date (metadata) | `D:20260518092355Z` = 2026-05-18. About 3 weeks before public launch. | Verify displayed date visually — see PENDING item below |
| Download filename | Fixed in Phase 18: all three resume link components now include `download="Muhammad_Sarib_Lead_UE5_Developer_Resume.pdf"`. Previously saved as `resume.pdf`. | FIXED |
| Searchable text | Cannot verify programmatically (no poppler/pdftotext). Link annotations are structured (not rasterized), which indicates proper PDF generation. | PENDING: open in Chrome PDF viewer, select and copy text to confirm it is selectable |
| Email address | Not found in link annotations. May be in body text. | PENDING: visual check |
| SwiftNine role | Cannot extract body text programmatically. | PENDING: visual check — confirm role title and dates match current PROFESSIONAL_HISTORY.md |
| Renders correctly | Not verified programmatically. | PENDING: open in Chrome PDF viewer, spot-check layout |

---

## PENDING items (Sarib manual verification)

1. **Searchable text**: Open `https://msarib.dev/resume.pdf` in Chrome. Try to select and copy a line of text. If selectable, it is searchable (not rasterized). If you can only select the whole page as an image, it is rasterized — needs regeneration.

2. **Date displayed in PDF**: Confirm the date shown in the resume body/footer reflects the correct timeframe (created 2026-05-18 per metadata).

3. **SwiftNine role**: Confirm the role title, dates, and description match the current source of record in `PROFESSIONAL_HISTORY.md`.

4. **Email address in body**: Confirm `msarib305@gmail.com` or the correct contact email is present in the body text.

5. **All links resolve**: Click each link in the PDF (portfolio, LinkedIn, YouTube, Samurai Saga, Fortnite). Confirm none 404.

---

## FIXED in Phase 18

**Download filename** — all three resume link locations now include the `download` attribute:

- `src/components/PillButton.tsx`: added `download?: string` prop, forwarded to `<Link>`
- `src/components/Footer.tsx:75`: `download="Muhammad_Sarib_Lead_UE5_Developer_Resume.pdf"` added to `<a>`
- `src/components/ContactCTA.tsx:17`: `download="…"` added to `PillButton`
- `src/components/Timeline.tsx:10`: `download="…"` added to `PillButton`

---

## Future Work

- **Resume regeneration**: When real ExpertiseCard videos ship or a new role is added, regenerate from the source DOCX and replace `public/resume.pdf`. Keep filename consistent: `public/resume.pdf` (URL path) with the `download` attribute forcing the saved name.
- **Lighthouse /about LCP**: Once the real portrait photo replaces the placeholder, re-run Lighthouse on `/about` mobile. Target >= 90 (Phase 14 D1). Current score: 85 (LCP 4449ms, portrait image is likely the bottleneck).
