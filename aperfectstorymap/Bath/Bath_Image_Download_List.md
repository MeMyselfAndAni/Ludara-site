# Bridgerton in Bath — Images

## Fastest way: run the fetch script
Double-click **`fetch-bath-images.bat`** in this folder. It downloads all 10
Creative Commons photos from Wikimedia Commons into `images\` as
`place-1.jpg` … `place-10.jpg` (1280px web size, with a full-resolution
fallback). Credits are already wired into `credits.js`, so each photo shows
its author and licence automatically. If any line reports `[FAILED]`, tell
Claude and we'll swap that one.

The old Shantaram photos have been moved to `images\_shantaram_old\` (they are
not used and are not deployed; you can delete that folder).

## The 10 sources (verified on Wikimedia Commons)

| id | Place | Author | Licence | Commons file |
|----|-------|--------|---------|--------------|
| 1 | Holburne Museum | Uhooep | CC BY-SA 4.0 | File:Holburne_Museum.jpg |
| 2 | Royal Crescent | Bärbel Miemietz | CC BY-SA 4.0 | File:2023-09-15_Bath_Royal_Crescent_05.jpg |
| 3 | No.1 Royal Crescent | Bärbel Miemietz | CC BY-SA 4.0 | File:2023-09-15_Bath_Royal_Crescent_01.jpg |
| 4 | Abbey Green | Andy Li | CC0 | File:London_plane_at_Abbey_Green,_Bath_2025-07-23.jpg |
| 5 | Bath Street | Tristan Surtel | CC BY-SA 4.0 | File:Bath_Street_colonnade.jpg |
| 6 | Beauford Square | Enrique Íñiguez Rodríguez (Qoan) | CC BY-SA 4.0 | File:Bath._Beauford_square.jpg |
| 7 | Trim Street | Rodw | Public domain | File:Trim_Street,_Bath.JPG |
| 8 | Assembly Rooms | Lewis Clarke | CC BY-SA 2.0 | File:Bath_,_Assembly_Rooms_-_geograph.org.uk_-_6566729.jpg |
| 9 | Guildhall | Ytfc23 | CC BY-SA 4.0 | File:Bath_Guildhall,_April_2020.jpg |
| 10 | Edward Street | Robin Webster | CC BY-SA 2.0 | File:Edward_Street,_Bath_-_geograph.org.uk_-_8220145.jpg |

Licence note: all except Abbey Green (CC0) and Trim Street (public domain)
require a visible author + licence credit, which `credits.js` provides on each
card. Do NOT use stills or promotional images from the Bridgerton production:
only real photographs of the Bath locations, CC-licensed.

Edward Street (10) is the weakest source on Commons (max ~1024px); it is the
only card where a sharper image would help later if one appears.
