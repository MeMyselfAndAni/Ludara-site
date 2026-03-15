@echo off
:: ─────────────────────────────────────────────────────────────
:: qa-check.bat — Verify platform files are in sync across guides
:: Skips guides whose folder doesn't exist yet
:: ─────────────────────────────────────────────────────────────
setlocal enabledelayedexpansion
set ROOT=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
set PLATFORM=%ROOT%\aperfectday\general\_platform

echo.
echo Checking platform files are in sync...
echo.

set GUIDES=wanderlush\tbilisi HLO\london
set PLATFORM_FILES=ui-card.js ui-filter.js ui-stories.js ui-favourites.js ui-pdf.js photos.js styles.css
set ERRORS=0

for %%G in (%GUIDES%) do (
  set GUIDE=%ROOT%\aperfectday\%%G

  :: Skip if guide folder doesn't exist yet
  if not exist "!GUIDE!\index.html" (
    echo Guide: %%G  [SKIPPED - not built yet]
    echo.
  ) else (
    echo Guide: %%G
    for %%F in (%PLATFORM_FILES%) do (
      if not exist "!GUIDE!\%%F" (
        echo   MISSING: %%F
        set ERRORS=1
      ) else (
        fc /b "%PLATFORM%\%%F" "!GUIDE!\%%F" >nul 2>&1
        if errorlevel 1 (
          echo   OUTDATED: %%F differs from _platform
          set ERRORS=1
        ) else (
          echo   OK: %%F
        )
      )
    )
    echo.
  )
)

if "%ERRORS%"=="1" (
  echo WARNING: Some guides have outdated platform files.
  echo Run deploy-all.bat to sync everything.
) else (
  echo All active guides are in sync with _platform.
)
echo.
pause
