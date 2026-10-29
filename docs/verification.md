# Verification record

Verified on **29 October 2026** against the actual `index.html` opened with a `file://` URL in **Brave / Chromium 156 on Windows**.

## Browser behavior

The automated suite in `tests/guide.test.cjs` passed **29 checks**:

- Offline loading, all 11 navigation entries, and one visible chapter in guided mode.
- Chapter navigation, direct URLs, browser Back, and resumed-session history.
- Interactive anatomy and decision helper.
- Progress/checklist persistence, reset, and Undo.
- Complete Markdown download with decoded characters and the intended filename.
- Exact text passed to the clipboard API, plus selectable text when clipboard methods fail. Clipboard success/denial are controlled in the test; this does not certify every operating system clipboard policy.
- Search through closed disclosures and hidden anatomy panels, arbitrary-input escaping, and the mobile results view.
- Quiz feedback for no selection, wrong selection, and correct selection.
- Continuous reading and return to guided view.
- Print expansion of chapters, disclosures, lifecycle/anatomy panels, and answer explanations; restoration afterward.
- Unique IDs and valid internal links/copy targets.
- No page-level horizontal overflow across every chapter at **1440, 1024, 768, 390, and 320 pixels**. Wide mobile tables scroll inside their own containers.
- Mobile navigation, Escape, hidden-menu focus behavior, and skip-link behavior.
- Reduced-motion behavior.
- JavaScript-disabled reading and mobile contents navigation.
- Useful behavior when local storage is blocked.
- No JavaScript page errors or external asset requests during the test journey.

The development-only results, screenshots, downloaded sample, and PDF are generated under `.qa/` and are not committed. No external services are contacted by the HTML during ordinary reading.

## Visual review and refinements

Reviewed desktop opening and anatomy screenshots, narrow mobile opening and Copilot screenshots, and rendered A4 PDF pages. Refined spacing, table column widths, mobile table scrolling, guided navigation, print fragmentation, and the handling of optional detail.

The print export is the complete expanded guide, including the source library. It is longer than the guided screen path because all advanced sections are included. Print chrome is hidden, headings stay with following content, and the lab remains text-selectable. The test PDF is generated with tags and an outline; this is not a PDF accessibility certification.

Issues found and corrected during review:

- Enhanced buttons were overriding flex layouts.
- Closed mobile navigation could remain in the keyboard path.
- Search could find content without revealing the relevant interactive panel.
- Search results could be offscreen or covered by the mobile menu.
- Resuming a saved chapter and then using Back could land on the wrong chapter.
- The skip link could interfere with chapter history.
- A print-only navigation element and avoidable page breaks appeared in PDF output.
- Clipboard denial needed an explicit selection fallback.

## Content review

Independent passes reviewed portable format claims, Copilot-specific facts, the running lab, and the learning sequence. Product behavior was checked against official primary sources linked inside the guide and recorded in `research/`.

Corrections included explicitly disabling the skill for baseline comparisons, tightening contradictory records to the same version and audience, distinguishing illustrative outcomes from measured results, clarifying replacement of the earlier minimal skill, and using a reviewed revision in the installation example.

The guide labels host extensions, experimental options, and documentation uncertainty. It does not treat recommended size limits, folder conventions, invocation syntax, or tool approvals as universally enforced standards.

## Limits

- The training skill was **not executed in the user's workplace Copilot environment**. Its sample output and behavior tests are authored expectations. Client versions, models, enterprise policy, and available tools can change the result.
- Browser testing was performed in Brave. Firefox, Safari, physical mobile devices, and screen-reader applications were not independently tested.
- The review includes semantic controls, keyboard behavior, reduced motion, readable colors, and responsive layouts; it is not a formal WCAG conformance audit.
- Source pages are living documentation reviewed on the stated date, not a guarantee about future releases.
- The PDF is a print verification artifact, not an additional required deliverable. The team only needs `index.html`.
