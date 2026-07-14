@echo off
setlocal
echo =====================================================
echo   THE BOOK OF LONGINGS - fetch Creative Commons images
echo   (only the sites Maria does NOT photograph herself)
echo =====================================================
echo.
echo Saves into the images\ folder next to this script.
echo Downloads a ~1400px version of each Commons file.
echo.

cd /d "%~dp0"
if not exist "images" mkdir "images"

echo Downloading place-5.jpg  (Jordan River - Berthold Werner, CC BY 3.0)...
curl -L -s -o "images\place-5.jpg" "https://commons.wikimedia.org/wiki/Special:FilePath/Jordan_Baptism_site_BW_4.JPG?width=1400"

echo Downloading place-6.jpg  (Alexandria - Alberto-g-rovi, CC BY-SA 3.0)...
curl -L -s -o "images\place-6.jpg" "https://commons.wikimedia.org/wiki/Special:FilePath/Ciudadela_de_qaitbay-alejandria-2007.JPG?width=1400"

echo.
echo Downloading place-9.jpg  (Bethany, Church of St Lazarus / Barluzzi - Djampa, CC BY-SA 4.0)...
curl -L -s -o "images\place-9.jpg" "https://commons.wikimedia.org/wiki/Special:FilePath/Bethany_Lazarus_church.jpg?width=1400"

echo Downloading place-12.jpg (Golgotha, Church of the Holy Sepulchre - Berthold Werner, CC BY-SA 3.0)...
curl -L -s -o "images\place-12.jpg" "https://commons.wikimedia.org/wiki/Special:FilePath/Jerusalem_Holy_Sepulchre_BW_19.JPG?width=1400"

echo.
echo Done. Files are in the images\ folder:
dir /b images\place-5.jpg images\place-6.jpg images\place-9.jpg 2>nul
echo.
echo Reminder: your OWN photos are
echo   place-1.jpg  Sepphoris / Zippori
echo   place-2.jpg  The Cave (your Galilee cave photo)
echo   place-3.jpg  Nazareth
echo   place-4.jpg  Sea of Galilee
echo   place-10.jpg Temple, Jerusalem (Second Temple model)
echo   place-11.jpg Gethsemane
echo The 2 AI images are place-7.jpg (Temple of Isis) and place-8.jpg (Therapeutae).
echo.
pause
endlocal
