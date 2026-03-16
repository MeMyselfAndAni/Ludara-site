@echo off
:: ═══════════════════════════════════════════════════════════════
:: deploy-all.bat — Deploy _platform files to ALL active guides
:: Runs QA check first and blocks deploy if errors found
::
:: To add a new guide:
::   1. Add it to the GUIDES list below
::   2. Also add it to qa-check.js GUIDES array
:: ═══════════════════════════════════════════════════════════════
setlocal enabledelayedexpansion

set ROOT=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
set PLATFORM=%ROOT%\aperfectday\general\_platform
set SCRIPT=%ROOT%\aperfectday\general\_deploy\qa-check.js

:: ── Run QA first ─────────────────────────────────────────────
echo.
echo Running QA checks before deploy...
echo.
node "%SCRIPT%"

if errorlevel 1 (
  echo.
  echo ═══════════════════════════════════════════════════
  echo  ❌ DEPLOY BLOCKED — fix QA errors first
  echo  Run qa-check.bat to see the full list of issues
  echo ═══════════════════════════════════════════════════
  echo.
  pause
  exit /b 1
)

echo.
echo ══════════════════════════════════════════
echo   QA passed — deploying platform files
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
echo   Done — all guides updated
echo ══════════════════════════════════════════
echo.
pause
