@echo off
REM ─── deploy-HLO-london.bat ────────────────────────────────────────────────
REM Syncs platform files into the guide folder, then git pushes to live server.
REM Guide-specific files (index.html, data.js, map.js, images/) are already
REM in the right place — they don't need copying.

SET ROOT=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
SET GUIDE=%ROOT%\aperfectday\HLO\london
SET PLATFORM=%ROOT%\aperfectday\general\_platform

echo.
echo Deploying HLO London...
echo.

REM Step 1 — Copy platform files into guide folder
echo Syncing platform files...
xcopy /Y "%PLATFORM%\styles.css"        "%GUIDE%\"
xcopy /Y "%PLATFORM%\photos.js"         "%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-card.js"        "%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-filter.js"      "%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-stories.js"     "%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-favourites.js"  "%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-pdf.js"         "%GUIDE%\"
xcopy /Y "%PLATFORM%\favicon.svg" "%GUIDE%\"

REM Step 2 — Git add, commit and push
echo.
echo Pushing to live server via git...
cd /d "%ROOT%"
git add -A
git commit -m "Deploy HLO London %DATE% %TIME%"
git push

echo.
echo Done! Live at: ludara.ai/aperfectday/HLO/london/
echo.
pause
