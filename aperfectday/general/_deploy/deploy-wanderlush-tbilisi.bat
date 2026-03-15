@echo off
:: ─────────────────────────────────────────────────────────────
:: deploy-wanderlush-tbilisi.bat
:: ─────────────────────────────────────────────────────────────
set ROOT=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
set PLATFORM=%ROOT%\aperfectday\general\_platform
set GUIDE=%ROOT%\aperfectday\wanderlush\tbilisi

echo.
echo Deploying: WanderLush / Tbilisi
echo.

if not exist "%GUIDE%" mkdir "%GUIDE%"

:: 1. Delete any stale platform files in guide folder first
echo Cleaning stale platform files...
for %%F in (ui-card.js ui-filter.js ui-stories.js ui-favourites.js ui-pdf.js photos.js styles.css) do (
  if exist "%GUIDE%\%%F" del "%GUIDE%\%%F" >nul
)

:: 2. Copy fresh platform files from _platform
echo Copying platform files...
for %%F in (ui-card.js ui-filter.js ui-stories.js ui-favourites.js ui-pdf.js photos.js styles.css) do (
  if exist "%PLATFORM%\%%F" (
    copy /Y "%PLATFORM%\%%F" "%GUIDE%\%%F" >nul
    echo   + %%F
  ) else (
    echo   MISSING in _platform: %%F
  )
)

:: 3. Git push
cd /d "%ROOT%"
git add aperfectday\wanderlush\
git commit -m "Deploy wanderlush/tbilisi %DATE% %TIME%"
git push

echo.
echo Done: https://ludara.ai/aperfectday/wanderlush/tbilisi
echo Ctrl+Shift+R to reload Chrome
echo.
pause
