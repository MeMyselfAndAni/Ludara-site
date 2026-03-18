@echo off
REM ── deploy-guide-v2.bat ─────────────────────────────────────────────────────
REM Usage: Set GUIDE= to the guide path, then run this bat file
REM Example: GUIDE=nomadicmatt\bangkok

SET ROOT=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
SET PLATFORM=%ROOT%\aperfectday\general\_platform-v2
SET GUIDE_PATH=%ROOT%\aperfectday\%GUIDE%

if "%GUIDE%"=="" (
  echo ERROR: Set GUIDE= before running. Example: set GUIDE=nomadicmatt\bangkok
  pause
  exit /b 1
)

echo Deploying: %GUIDE%
echo.

REM Copy shared platform files to guide folder
xcopy /Y "%PLATFORM%\styles.css"         "%GUIDE_PATH%\" >nul
xcopy /Y "%PLATFORM%\photos.js"          "%GUIDE_PATH%\" >nul
xcopy /Y "%PLATFORM%\ui-card.js"         "%GUIDE_PATH%\" >nul
xcopy /Y "%PLATFORM%\ui-filter.js"       "%GUIDE_PATH%\" >nul
xcopy /Y "%PLATFORM%\ui-favourites.js"   "%GUIDE_PATH%\" >nul
xcopy /Y "%PLATFORM%\ui-pdf.js"          "%GUIDE_PATH%\" >nul
xcopy /Y "%PLATFORM%\ui-stories.js"      "%GUIDE_PATH%\" >nul
xcopy /Y "%PLATFORM%\map-core.js"        "%GUIDE_PATH%\" >nul
xcopy /Y "%PLATFORM%\sw.js"              "%GUIDE_PATH%\" >nul
xcopy /Y "%PLATFORM%\favicon.svg"        "%GUIDE_PATH%\" >nul
echo   Platform files synced to %GUIDE%

REM Git push
cd /d "%ROOT%"
git add -A
git commit -m "Deploy %GUIDE% %DATE% %TIME%"
git push

echo.
echo Done! Live at: ludara.ai/aperfectday/%GUIDE%/
pause
