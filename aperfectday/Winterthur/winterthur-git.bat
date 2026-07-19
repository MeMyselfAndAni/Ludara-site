@echo off
setlocal enabledelayedexpansion
echo ================================
echo   WINTERTHUR GIT COMMIT ^& DEPLOY
echo ================================

set "WORKING=C:\Users\Maria\OneDrive\Dokumentumok\Claude\Projects\A Perfect Day\Winterthur"
set "DEPLOY=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\Winterthur"
rem  Expected live URL after push:  https://ludara.ai/aperfectday/winterthur/

echo.
echo Working copy : %WORKING%
echo Deploy folder: %DEPLOY%
echo.

if not exist "%WORKING%\index.html" (
  echo [ERROR] Working copy not found at %WORKING%
  pause ^& exit /b 1
)

rem --- Create the deploy folder if this is the first push ---
if not exist "%DEPLOY%" (
  echo Creating deploy folder...
  mkdir "%DEPLOY%"
)
if not exist "%DEPLOY%\photos" mkdir "%DEPLOY%\photos"

echo.
echo Copying guide files into the live site...
for %%F in (index.html data.js map.js map-core.js i18n.js ui-card.js ui-filter.js ui-stories.js ui-favourites.js ui-pdf.js tutorial.js photos.js credits.js styles.css sw.js favicon.svg universal-distance-functionality.js) do (
  if exist "%WORKING%\%%F" (
    copy /Y "%WORKING%\%%F" "%DEPLOY%\%%F" >nul && echo   copied %%F
  ) else (
    echo   [skip] %%F not found
  )
)

echo.
echo Copying local photos (place-*.jpg) into the live site...
copy /Y "%WORKING%\photos\place-*.jpg" "%DEPLOY%\photos\" >nul && echo   copied photos
rem  Note: most place images load directly from winterthur.org (see data.js "img" fields);
rem  only the local place-*.jpg files need copying.

echo.
echo Navigating to deploy folder...
cd /d "%DEPLOY%"
echo Current directory: %CD%

rem --- Confirm we are inside a git repository (git walks up to find .git) ---
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [ERROR] %DEPLOY% is not inside a git repository.
  echo Make sure the aperfectday site repo is cloned/initialised.
  pause ^& exit /b 1
)

echo.
echo Staging changes in the Winterthur folder...
git add .

echo.
echo Current status:
git status --short

rem --- Bail out cleanly if nothing changed ---
git diff --cached --quiet
if not errorlevel 1 (
  echo.
  echo [info] No changes to commit. Exiting.
  pause ^& exit /b 0
)

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set "commit_msg=Winterthur: update visitor guide"

echo.
echo Committing: "%commit_msg%"
git commit -m "%commit_msg%"
if errorlevel 1 ( echo [ERROR] Commit failed. ^& pause ^& exit /b 1 )

echo.
echo Pushing to repository...
git push
if errorlevel 1 (
  echo.
  echo [ERROR] Push failed. Check your branch, remote, and credentials.
  pause ^& exit /b 1
)

echo.
echo ================================
echo   WINTERTHUR COMMITTED ^& PUSHED!
echo ================================
echo.
echo Test online in a minute or two at:
echo   https://ludara.ai/aperfectday/winterthur/
echo.
pause
endlocal
