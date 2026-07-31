# Bar-Or family map — BUILT 31 Jul 2026

## Status: the guide is built and runs. Not yet deployed.
Run `barorfamily-git.bat` to publish to ludara.ai/familystorymap/barorfamily/ (private, noindex).

## What it contains
- **32 places** from "הספר של זהבה", every one carrying Zehava's own wording.
- **27 people** in the family tree, 5 generations.
- **13 archive photographs** cropped from the book into `images/place-N.jpg`.
- Splash / og image built from the Kraków photograph (the only pre-war picture).

## Key decisions
- **HEBREW ONLY.** No lang.js, no language buttons, no #lang-fab. One "להיכנס לסיפור" button.
- Regions (nbhd): poland · ukraine · east · uzbekistan · europe · israel · memorial
- Categories (cat): narcyz · urbach · war · israel · memorial
- sw cache namespace: `apsm-barorfamily-shell-v1` (bump on every deploy)
- `credits.js` is empty on purpose: every image is family archive material from the book.

## The uncertainty is IN the map, not hidden
8 places are flagged `uncertain: true` and carry a "⚠️ הערת ודאות" paragraph at the end
of the card explaining exactly what the book does and does not say. Do not tidy these away.
- **id 7** — Zehava's birthplace. The book says Donbas AND "not far from Lviv" in one
  sentence, and never names the town. The pin sits on Donbas only because that is the sole
  place-name given as a residence; the card says so plainly.
- **id 23** — Auschwitz-Birkenau. Card uses the cautious chapter-2 wording
  ("מחוסר מידע מדויק על גורלם, סביר והגיוני להניח"), NOT the flat chapter-9 assertion.
  Both are quoted in the uncertainty note.
- **id 12** — the town whose name Zehava never knew. The book has no location at all,
  so the pin sits at a deliberately neutral point on the return route and the card says so.
- Also uncertain: id 2 (a river, not a town), 8 (a route), 10 (unnamed village), 21, 32.

In people.js: `chaya_siblings` is ONE node standing for all of Chaya's brothers and sisters,
because the book names none of them. The 7 grandchildren hang off Zehava by dashed edge,
not off a son, because the book never says which grandchild belongs to which son.
Feigele's edge is flagged: the book never says which side of the family she is from.

## Still open
- The 4 questions in `Questions_for_the_Bar-Or_family.md` remain unanswered (Zehava's
  memory is no longer reliable). Yad Vashem Pages of Testimony and Arolsen Archives are
  searchable without her and could settle the fate question.
- Chapter 19 "מסיפורי סבתא" is listed in the book's contents but missing from the file.
- A direct photo of the aluminium lid may reveal dates beyond "PEISKRETSCHAM".
- Nothing has been shown to the family yet. Get their consent before sharing the link.
