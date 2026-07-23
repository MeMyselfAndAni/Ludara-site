@echo off
setlocal enabledelayedexpansion
echo ================================
echo   EVMOLPIA / PLOVDIV GIT COMMIT ^& DEPLOY
echo   (A Perfect Day in Plovdiv - Hotel Evmolpia sample)
echo ================================

set "WORKING=C:\Users\Maria\OneDrive\Dokumentumok\Claude\Projects\A Perfect Day\Evmolpia"
set "DEPLOY=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\Evmolpia"
rem  ------------------------------------------------------------------
rem  ASSUMED live URL after push:  https://ludara.ai/aperfectday/Evmolpia/
rem  Maria: if you want a different folder/URL (e.g. .../evmolpia/),
rem  just change DEPLOY above and the URL lines at the bottom, or tell
rem  Claude and we adjust. Sample guide - share the URL only with Hotel
rem  Evmolpia; do not link it publicly until you approve.
rem  NOTE: if your site repo is rooted at aperfectday rather than
rem  Ludara-site, git may report "not inside a git repository" below -
rem  tell Claude and we adjust the deploy path.
rem  ------------------------------------------------------------------

echo.
echo Working copy : %WORKING%
echo Deploy folder: %DEPLOY%
echo.

if not exist "%WORKING%\index.html" (
  echo [ERROR] Working copy not found at %WORKING%
  pause & exit /b 1
)

rem --- Create the deploy folder if this is the first push ---
if not exist "%DEPLOY%" (
  echo Creating deploy folder...
  mkdir "%DEPLOY%"
)
if not exist "%DEPLOY%\images" mkdir "%DEPLOY%\images"
if not exist "%DEPLOY%\Branding" mkdir "%DEPLOY%\Branding"

echo.
echo Copying guide files into the live site...
for %%F in (index.html data.js map.js map-core.js ui-card.js ui-filter.js ui-stories.js ui-favourites.js ui-pdf.js tutorial.js photos.js credits.js styles.css sw.js favicon.svg universal-distance-functionality.js manifest.json minimize-images.js) do (
  if exist "%WORKING%\%%F" (
    copy /Y "%WORKING%\%%F" "%DEPLOY%\%%F" >nul && echo   copied %%F
  ) else (
    echo   [skip] %%F not found
  )
)

echo.
echo Copying branding assets...
copy /Y "%WORKING%\Branding\*" "%DEPLOY%\Branding\" >nul && echo   copied Branding\*

rem --- PLACE IMAGES ARE MANAGED DIRECTLY IN THE DEPLOY FOLDER. ---
rem --- On first deploy (empty images folder) we seed them once; after
rem --- that your edits in  %DEPLOY%\images  are preserved. ---
dir /b "%DEPLOY%\images\*.jpg" >nul 2>&1
if errorlevel 1 (
  echo Seeding place images, first deploy...
  copy /Y "%WORKING%\images\*.jpg" "%DEPLOY%\images\" >nul 2>&1 && echo   copied images\* || echo   (no images to seed yet)
) else (
  echo   deploy images left untouched
)

echo.
echo Navigating to deploy folder...
cd /d "%DEPLOY%"
echo Current directory: %CD%

rem --- Confirm we are inside a git repository (git walks up to find .git) ---
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [ERROR] %DEPLOY% is not inside a git repository.
  echo Tell Claude and we adjust the deploy path or the repo.
  pause & exit /b 1
)

echo.
echo Staging changes in the Plovdiv folder...
git add .

echo.
echo Current status:
git status --short

rem --- Bail out cleanly if nothing changed ---
git diff --cached --quiet
if not errorlevel 1 (
  echo.
  echo [info] No changes to commit. Exiting.
  pause & exit /b 0
)

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set "commit_msg=Plovdiv: update Hotel Evmolpia sample guide"

echo.
echo Committing: "%commit_msg%"
git commit -m "%commit_msg%"
if errorlevel 1 ( echo [ERROR] Commit failed. & pause & exit /b 1 )

echo.
echo Pushing to repository...
git push
if errorlevel 1 (
  echo.
  echo [ERROR] Push failed. Check your branch, remote, and credentials.
  pause & exit /b 1
)

echo.
echo ================================
echo   PLOVDIV COMMITTED ^& PUSHED!
echo ================================
echo.
echo Test online in a minute or two at:
echo   https://ludara.ai/aperfectday/Evmolpia/
echo.
echo Sample guide - share the URL only with Hotel Evmolpia for now.
echo.
pause
endlocal
