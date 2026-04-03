@echo off
REM ============================================================
REM  deploy-TODO_BLOGGER-TODO_CITY.bat
REM  Deploys TODO_BLOGGER / TODO_CITY guide (v2 MapLibre)
REM
REM  Run from:  ...\Ludara-site\aperfectday\general\_deploy\
REM  Live at:   https://ludara.ai/aperfectday/TODO_BLOGGER/TODO_CITY/
REM ============================================================

set GUIDE=TODO_BLOGGER\TODO_CITY

echo.
echo ==========================================================
echo  Deploying: %GUIDE%
echo ==========================================================
echo.

set REPO_ROOT=%~dp0..\..
set PLATFORM=%REPO_ROOT%\general\_platform-v2
set DEST=%REPO_ROOT%\%GUIDE%

if not exist "%PLATFORM%" (
  echo ERROR: _platform-v2 not found at %PLATFORM%
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
git add -A
git commit -m "Deploy TODO_BLOGGER/TODO_CITY — A Perfect Day guide"
git push

echo.
echo ==========================================================
echo  Done! Live in ~30s at:
echo  https://ludara.ai/aperfectday/TODO_BLOGGER/TODO_CITY/
echo ==========================================================
echo.
pause
