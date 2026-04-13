@echo off
SET ROOT=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
SET PLATFORM=%ROOT%\aperfectday\general\_platform-v2
SET GUIDE=%ROOT%\aperfectday\wanderlush\tbilisi

echo Syncing platform files into tbilisi-offline...
xcopy /Y "%PLATFORM%\map-core.js"        "%GUIDE%\" >nul
xcopy /Y "%PLATFORM%\styles.css"         "%GUIDE%\" >nul
xcopy /Y "%PLATFORM%\photos.js"          "%GUIDE%\" >nul
xcopy /Y "%PLATFORM%\ui-card.js"         "%GUIDE%\" >nul
xcopy /Y "%PLATFORM%\ui-filter.js"       "%GUIDE%\" >nul
xcopy /Y "%PLATFORM%\ui-favourites.js"   "%GUIDE%\" >nul
xcopy /Y "%PLATFORM%\ui-pdf.js"          "%GUIDE%\" >nul
xcopy /Y "%PLATFORM%\ui-stories.js"      "%GUIDE%\" >nul
xcopy /Y "%PLATFORM%\sw.js"              "%GUIDE%\" >nul
xcopy /Y "%PLATFORM%\favicon.svg"        "%GUIDE%\" >nul
echo   Done.

echo.
echo Pushing to git...
cd /d "%ROOT%"
git add -A
git commit -m "Update tbilisi %DATE% %TIME%"
git push

echo.
echo Done! Live at: ludara.ai/aperfectday/wanderlush/tbilisi/
pause
