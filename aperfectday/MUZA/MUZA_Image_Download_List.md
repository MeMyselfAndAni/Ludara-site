# MUZA — image download list

All photos are the museum's own, from **eretzmuseum.org.il**. Save each URL into
`MUZA/images/` with the **exact filename** shown (so `photos.js` picks it up), then run
`minimize-images.js`, then `muza-git.bat`.

Tip: in Chrome, right-click the image → "Save image as…" → set the filename to `place-<id>.jpg`.
A few URLs have Hebrew characters — they still open and download fine; just rename on save.

## Images found (19)

| Save as | Place | Source image URL |
|---|---|---|
| place-1.jpg | Ceramics Pavilion | https://www.eretzmuseum.org.il/wp-content/uploads/2023/09/0A8A5636_low-1024x683.jpg |
| place-2.jpg | Glass Pavilion | https://www.eretzmuseum.org.il/wp-content/uploads/2024/01/010-1024x681.jpg |
| place-3.jpg | Kadman Numismatic Pavilion | https://www.eretzmuseum.org.il/wp-content/uploads/2023/08/0A8A5618-1024x682.jpg |
| place-4.jpg | Nehushtan Pavilion | https://www.eretzmuseum.org.il/wp-content/uploads/2023/08/ביתן-מחושתן_ליאוניד-פדרול-1024x681.jpg |
| place-5.jpg | Man and His Work Center | https://www.eretzmuseum.org.il/wp-content/uploads/2023/08/0A8A5671-1024x682.jpg |
| place-6.jpg | Jewish Culture & Folklore Pavilion | https://www.eretzmuseum.org.il/wp-content/uploads/2024/04/הביתן-לתרבות-יהודית-ולפולקלור_צילום-ליאת-אלבלינג_1-min-1024x683.jpg |
| place-7.jpg | Alexander Pavilion (Post & Philately) | https://www.eretzmuseum.org.il/wp-content/uploads/2023/08/0A8A5734-1024x682.jpg |
| place-8.jpg | Rothschild Center / Biennale 2026 | https://www.eretzmuseum.org.il/wp-content/uploads/2025/06/ורד-אהרונוביץ_-נ-1980-ילדה-עם-כנפיים-2023-צילום_-מיכאל-לירן--1024x768.jpeg |
| place-10.jpg | Klatchkin Center (Postcards from Yesterday) | https://www.eretzmuseum.org.il/wp-content/uploads/2024/10/גלויות-מאתמול_ורה-ולדימירסקי-1024x576.jpg |
| place-11.jpg | Tell Qasile | https://www.eretzmuseum.org.il/wp-content/uploads/2023/08/DJI_0056-1024x576.jpg |
| place-12.jpg | The Temples (Tell Qasile) | https://www.eretzmuseum.org.il/wp-content/uploads/2023/08/DJI_0065-1024x576.jpg |
| place-13.jpg | Square of Mosaic Floors | https://www.eretzmuseum.org.il/wp-content/uploads/2023/08/0A8A5685-1024x682.jpg |
| place-14.jpg | Olive Press (Beit Ha'Bad) | https://www.eretzmuseum.org.il/wp-content/uploads/2024/03/בית-הבד-במוזא_6-1024x576.jpg |
| place-18.jpg | MUZA Park (Bustan) | https://www.eretzmuseum.org.il/wp-content/uploads/2023/09/DJI_0664_1800-1024x683.jpg |
| place-21.jpg | Laski Planetarium | https://www.eretzmuseum.org.il/wp-content/uploads/2023/06/MUZA-Planetarium_photo-leonid-Pedrol_310-1024x822.jpg |
| place-22.jpg | Main Entrance & grounds (aerial) | https://www.eretzmuseum.org.il/wp-content/uploads/2023/08/DJI_0006-1024x576.jpg |
| place-25.jpg | Nofim Hall (Photo: Tal Izsak) | https://www.eretzmuseum.org.il/wp-content/uploads/2024/10/אולם-נופים-מוזא_צילום-טל-איזק_2-1024x577.jpg |

### From Wikimedia Commons (free-licensed — credited to the photographer)

| Save as | Place | Full-res download | Credit |
|---|---|---|---|
| place-15.jpg | Flour Mill (water mill) | https://commons.wikimedia.org/wiki/Special:FilePath/Eretz-israel-museum-7068.jpg | Bukvoed, CC BY 4.0 |
| place-17.jpg | Wine Press (gatot) | https://commons.wikimedia.org/wiki/Special:FilePath/Gatot_110.jpg | Ori~, CC BY-SA 3.0 |

(These two already carry the correct CC credit in `credits.js`.)

## Still need a photo (6) — these stay as the coloured icon until you add one

place-9 Migdal Gallery · place-16 Sundial Square · place-19 Jotam's Parable Garden ·
place-20 Open-Air Theater · place-23 Museum Shop · place-24 Anina Café

No genuine image exists for these on the museum site or Wikimedia Commons, so I've left them as icons rather than attach a wrong photo. Drop your own in as `place-<id>.jpg` and tell me the credit to use.

## place-8 (Biennale) — you're supplying a recent photo

The current place-8 is the 2026 Biennale's official featured artwork (Vered Aharonovich, "Girl with Wings," 2023, photo Michael Liran). If you have a more recent/representative shot, save it over `place-8.jpg` and tell me the photographer — I'll update the credit.

## Credits

`credits.js` currently credits every photo as **"Photo: Eretz Israel Museum"** (linked to eretzmuseum.org.il).
A few are by named photographers if you'd like to credit them specifically:
- place-8 (Biennale): Michael Liran
- place-10 (Postcards from Yesterday): work by Vera Vladimirsky
- place-21 (Planetarium) and place-4 (Nehushtan): Leonid Pedrol

Say the word and I'll switch `credits.js` to per-photo credits.
