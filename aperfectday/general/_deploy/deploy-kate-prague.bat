@echo off
REM ============================================================
REM  deploy-kate-prague.bat
REM  Deploys the Adventurous Kate / Prague guide (v2 MapLibre)
REM
REM  Run from:  aperfectday\general\_deploy\
REM  Live at:   https://ludara.ai/aperfectday/AdventurousKate/Prague/
REM ============================================================

set GUIDE=AdventurousKate\Prague

echo.
echo ==========================================================
echo  Deploying: %GUIDE%
echo ==========================================================
echo.

set REPO_ROOT=%~dp0..\..
set PLATFORM=%REPO_ROOT%\general\_platform-v2
set DEST=%REPO_ROOT%\%GUIDE%

if not exist "%PLATFORM%" (
  echo ERROR: _platform-v2 folder not found at %PLATFORM%
  pause & exit /b 1
)
if not exist "%DEST%" (
  echo ERROR: Guide folder not found at %DEST%
  echo        Create it and add map.js, index.html, data.js, images\ first.
  pause & exit /b 1
)

echo Copying shared platform files...
copy /Y "%PLATFORM%\map-core.js"       "%DEST%\map-core.js"
copy /Y "%PLATFORM%\styles.css"        "%DEST%\styles.css"
copy /Y "%PLATFORM%\photos.js"         "%DEST%\photos.js"
copy /Y "%PLATFORM%\ui-card.js"        "%DEST%\ui-card.js"
copy /Y "%PLATFORM%\ui-filter.js"      "%DEST%\ui-filter.js"
copy /Y "%PLATFORM%\ui-favourites.js"  "%DEST%\ui-favourites.js"
copy /Y "%PLATFORM%\ui-pdf.js"         "%DEST%\ui-pdf.js"
copy /Y "%PLATFORM%\ui-stories.js"     "%DEST%\ui-stories.js"
copy /Y "%PLATFORM%\sw.js"             "%DEST%\sw.js"
copy /Y "%PLATFORM%\favicon.svg"       "%DEST%\favicon.svg"
echo Done.
echo.

cd /d "%REPO_ROOT%"

echo Staging all changes...
git add -A

echo.
echo Committing...
git commit -m "Deploy %GUIDE% — Adventurous Kate Prague guide"

echo.
echo Pushing to GitHub...
git push

echo.
echo ==========================================================
echo  Done! Live in ~30s at:
echo  https://ludara.ai/aperfectday/adventurouskate/prague/
echo ==========================================================
echo.
pause
