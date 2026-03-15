@echo off
:: ─────────────────────────────────────────────────────────────
:: deploy-hmo-london.bat
:: Run from: C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
:: ─────────────────────────────────────────────────────────────
set ROOT=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
set PLATFORM=%ROOT%\aperfectday\general\_platform
set GUIDE=%ROOT%\aperfectday\HLO\london

echo.
echo Deploying: HMO / London
echo.

if not exist "%GUIDE%" mkdir "%GUIDE%"

:: 1. Copy shared platform files
for %%F in (ui-card.js ui-filter.js ui-stories.js ui-favourites.js ui-pdf.js photos.js styles.css) do (
  copy /Y "%PLATFORM%\%%F" "%GUIDE%\%%F" >nul && echo   + %%F
)

:: 2. Copy guide-specific files
for %%F in (index.html data.js map.js) do (
  copy /Y "%ROOT%\aperfectday\HLO\london\%%F" "%GUIDE%\%%F" >nul && echo   + %%F
)

:: 3. Git push
cd /d "%ROOT%"
git add aperfectday\hmo\
git commit -m "Deploy HLO/london %DATE% %TIME%"
git push

echo.
echo Done: https://ludara.ai/aperfectday/HLO/london
echo Ctrl+Shift+R to reload Chrome
pause
