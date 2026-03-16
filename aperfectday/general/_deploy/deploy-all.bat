@echo off
REM ─── deploy-all.bat — Deploy ALL guides ───────────────────────────────────
REM Runs QA first, then syncs platform files to every guide and git pushes.

SET ROOT=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
SET PLATFORM=%ROOT%\aperfectday\general\_platform
SET SCRIPT=%ROOT%\aperfectday\general\_deploy\qa-check.js

REM ── Run QA first ─────────────────────────────────────────────────────────
echo.
echo Running QA checks...
echo.
node "%SCRIPT%"

if errorlevel 1 (
  echo.
  echo ❌ DEPLOY BLOCKED — fix QA errors first.
  echo.
  pause
  exit /b 1
)

echo.
echo ══════════════════════════════════════════
echo   QA passed — deploying all guides
echo ══════════════════════════════════════════
echo.

REM ── Add new guides here when ready ───────────────────────────────────────
set GUIDES=wanderlush\tbilisi HLO\london

for %%G in (%GUIDES%) do (
  setlocal enabledelayedexpansion
  set GUIDE=%ROOT%\aperfectday\%%G

  if not exist "!GUIDE!\index.html" (
    echo Guide %%G — SKIPPED ^(folder not found^)
  ) else (
    echo Guide: %%G
    xcopy /Y "%PLATFORM%\styles.css"        "!GUIDE!\" >nul
    xcopy /Y "%PLATFORM%\photos.js"         "!GUIDE!\" >nul
    xcopy /Y "%PLATFORM%\ui-card.js"        "!GUIDE!\" >nul
    xcopy /Y "%PLATFORM%\ui-filter.js"      "!GUIDE!\" >nul
    xcopy /Y "%PLATFORM%\ui-stories.js"     "!GUIDE!\" >nul
    xcopy /Y "%PLATFORM%\ui-favourites.js"  "!GUIDE!\" >nul
    xcopy /Y "%PLATFORM%\ui-pdf.js"         "!GUIDE!\" >nul
    echo   platform files synced
  )
  endlocal
  echo.
)

REM ── Git push everything ───────────────────────────────────────────────────
cd /d "%ROOT%"
git add -A
git commit -m "Deploy all guides %DATE% %TIME%"
git push

echo.
echo ══════════════════════════════════════════
echo   Done — all guides live
echo ══════════════════════════════════════════
echo.
pause
