@echo off
REM ─── deploy-wanderlush-tbilisi.bat ────────────────────────────────────────

SET ROOT=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
SET GUIDE=%ROOT%\aperfectday\wanderlush\tbilisi
SET PLATFORM=%ROOT%\aperfectday\general\_platform

echo.
echo Deploying Wanderlush Tbilisi...
echo.

echo Syncing platform files...
xcopy /Y "%PLATFORM%\styles.css"        "%GUIDE%\"
xcopy /Y "%PLATFORM%\photos.js"         "%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-card.js"        "%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-filter.js"      "%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-stories.js"     "%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-favourites.js"  "%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-pdf.js"         "%GUIDE%\"
xcopy /Y "%PLATFORM%\favicon.svg" "%GUIDE%\"

echo.
echo Pushing to live server via git...
cd /d "%ROOT%"
git add -A
git commit -m "Deploy Wanderlush Tbilisi %DATE% %TIME%"
git push

echo.
echo Done! Live at: ludara.ai/aperfectday/wanderlush/tbilisi/
echo.
pause
