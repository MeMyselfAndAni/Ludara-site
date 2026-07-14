# The Book of Longings — Image Plan

Every card loads `images/place-<id>.jpg`. Missing files fall back to the emoji marker, so nothing breaks if one is not ready yet. Landscape works best (aim ~1200 x 900).

**Before adding new images: delete the old Shantaram photos** still sitting in `images/` (place-1.jpg … place-12.jpg are Mumbai shots). Then drop in the files below with the same names.

## Where each image comes from

| id | Place | Source | File name | Credit line |
|----|-------|--------|-----------|-------------|
| 1 | Sepphoris / Zippori | **Your photo** | place-1.jpg | Photo: Maria Lando |
| 2 | The Cave in the Hills | **Your photo** (a real Galilee cave) | place-2.jpg | Photo: Maria Lando |
| 3 | Nazareth | **Your photo** | place-3.jpg | Photo: Maria Lando |
| 4 | The Sea of Galilee | **Your photo** | place-4.jpg | Photo: Maria Lando |
| 5 | The Jordan River | Commons | place-5.jpg | Berthold Werner — CC BY 3.0 |
| 6 | Alexandria | Commons | place-6.jpg | Alberto-g-rovi — CC BY-SA 3.0 |
| 7 | The Temple of Isis | **AI** (ancient, unlocated) | place-7.jpg | Illustration |
| 8 | The Therapeutae, Lake Mareotis | **AI** (ancient, unlocated) | place-8.jpg | Illustration |
| 9 | Bethany | Commons | place-9.jpg | Djampa — CC BY-SA 4.0 (Church of St Lazarus, Barluzzi) |
| 10 | The Temple, Jerusalem | **Your photo** | place-10.jpg | Photo: Maria Lando |
| 11 | Gethsemane | **Your photo** | place-11.jpg | Photo: Maria Lando |
| 12 | Golgotha | Commons | place-12.jpg | Berthold Werner — CC BY-SA 3.0 (Holy Sepulchre facade) |

Credits are already wired in `credits.js`. If you use your **own** Bethany photo for id 9, change that entry in `credits.js` to `{ author: 'Maria Lando' }`.

## The two Commons downloads

Run **`fetch-bookoflongings-images.bat`** (double-click) to pull the Jordan River and Alexandria images into `images/`. It offers the Bethany fallback as an optional extra. All licenses verified on the Commons file pages 2026-07-14.

- Jordan River: https://commons.wikimedia.org/wiki/File:Jordan_Baptism_site_BW_4.JPG (Berthold Werner, CC BY 3.0 — Quality Image; the actual baptism reach, Israel on the left, Jordan on the right)
- Alexandria: https://commons.wikimedia.org/wiki/File:Ciudadela_de_qaitbay-alejandria-2007.JPG (Alberto-g-rovi, CC BY-SA 3.0 — the Qaitbay citadel on the sea, standing on the site of the ancient Pharos lighthouse)
- Bethany: https://commons.wikimedia.org/wiki/File:Bethany_Lazarus_church.jpg (Djampa, CC BY-SA 4.0 — the Barluzzi Church of Saint Lazarus, the modern landmark at Bethany)
- Golgotha: https://commons.wikimedia.org/wiki/File:Jerusalem_Holy_Sepulchre_BW_19.JPG (Berthold Werner, CC BY-SA 3.0 — the Church of the Holy Sepulchre entrance facade)

## AI prompts for the 3 invented / unlocated places

Style for all three, to keep them a set: warm, natural light, photographic-illustrative, first-century Eastern Mediterranean, **no people, no text, no watermark, no modern objects**, landscape 4:3.

**place-2.jpg — The Cave in the Hills**
> A hidden limestone cave in the dry hills of first-century Galilee. Warm sandstone walls, a single shaft of daylight falling from the entrance onto a rock ledge where a few rolled papyrus scrolls and a small clay incantation bowl rest. Quiet, secret, sacred. Warm golden light, soft shadows, photographic, no people, no text.

**place-7.jpg — The Temple of Isis (Alexandria)**
> An ancient Egyptian temple of the goddess Isis in Roman-era Alexandria, first century. Tall sandstone columns with lotus and papyrus capitals, a shadowed sanctuary lit by oil lamps and shafts of light, faint incense smoke, a serene stone statue of Isis in the distance. Atmospheric, reverent, cinematic, no people, no modern elements, no text.

**place-8.jpg — The Therapeutae, Lake Mareotis**
> A modest first-century contemplative community of simple whitewashed stone dwellings on a low hill above Lake Mareotis near Alexandria. Reeds and calm still water below, scattered olive trees, soft dawn light, a papyrus scroll and reed pen on a plain stone bench. Serene, scholarly, peaceful, warm muted palette, no people, no text.

## Deploy

Once images are in `images/`, run **`bookoflongings-git.bat`** to copy the guide (engine files + images) into the live site and push. Live URL: `https://ludara.ai/aperfectstorymap/bookoflongings/` (unlisted; noindex; share only in pitches).
