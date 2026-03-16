@echo off
:: ═══════════════════════════════════════════════════════════════
:: qa-check.bat — Full automated QA for the A Perfect Day platform
:: Runs qa-check.js which detects:
::   - JS syntax errors in all files
::   - Hardcoded guide strings in _platform files
::   - Missing FAVS_KEY in data.js
::   - Duplicate variable declarations that crash the app
::   - Neighbourhood ID mismatches
::   - Place count badge mismatches
::   - Missing category colours/labels
::   - Duplicate place IDs
::   - FAVS_KEY collisions across guides
::   - Platform files out of sync with _platform master
::   - Unfilled template placeholders
:: ═══════════════════════════════════════════════════════════════

set ROOT=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
set SCRIPT=%ROOT%\aperfectday\general\_deploy\qa-check.js

node "%SCRIPT%"

if errorlevel 1 (
  echo.
  echo ❌ QA FAILED — do not deploy until all errors are fixed.
  echo.
) else (
  echo.
  echo ✅ QA PASSED — safe to run deploy-all.bat
  echo.
)
pause
