@echo off
:: ─────────────────────────────────────────────────────────────
:: deploy-all.bat — Push _platform files to ALL active guides
:: Skips guides whose folder doesn't exist yet
:: ─────────────────────────────────────────────────────────────
setlocal enabledelayedexpansion
set ROOT=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
set PLATFORM=%ROOT%\aperfectday\general\_platform

echo.
echo ══════════════════════════════════════════
echo   Deploying platform to ALL guides
echo ══════════════════════════════════════════
echo.

:: ── Add new guides to this list when ready ───────────────────
set GUIDES=wanderlush\tbilisi HLO\london

for %%G in (%GUIDES%) do (
  set GUIDE=%ROOT%\aperfectday\%%G

  if not exist "!GUIDE!\index.html" (
    echo Guide: %%G  [SKIPPED - not built yet]
  ) else (
    echo Guide: %%G
    for %%F in (ui-card.js ui-filter.js ui-stories.js ui-favourites.js ui-pdf.js photos.js styles.css) do (
      copy /Y "%PLATFORM%\%%F" "!GUIDE!\%%F" >nul
      echo   + %%F
    )
  )
  echo.
)

cd /d "%ROOT%"
git add aperfectday\
git commit -m "Platform update all guides %DATE% %TIME%"
git push

echo.
echo ══════════════════════════════════════════
echo   Done
echo ══════════════════════════════════════════
echo.
pause
