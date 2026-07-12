@echo off
setlocal enabledelayedexpansion
echo ================================
echo   BATH GIT COMMIT ^& DEPLOY
echo   (A Perfect Story Map - Bath and Bristol on Screen)
echo ================================

set "WORKING=C:\Users\Maria\OneDrive\Dokumentumok\Claude\Projects\A Perfect Day\aperfectstorymap\Bath-Bristol"
set "DEPLOY=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectstorymap\Bath-Bristol"
rem  Expected live URL after push:  https://ludara.ai/aperfectstorymap/Bath-Bristol/
rem  UNLISTED DEMO: page carries noindex; never link it from the public site.
rem  NOTE: if the git repo is rooted at Ludara-site this works as-is.
rem  If the repo is rooted at aperfectday instead, git will report
rem  "not inside a git repository" below - tell Claude and we adjust.

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

echo.
echo Copying story map files into the live site...
for %%F in (index.html data.js map.js map-core.js ui-card.js ui-filter.js ui-stories.js ui-favourites.js ui-pdf.js tutorial.js photos.js credits.js styles.css favicon.svg) do (
  if exist "%WORKING%\%%F" (
    copy /Y "%WORKING%\%%F" "%DEPLOY%\%%F" >nul && echo   copied %%F
  ) else (
    echo   [skip] %%F not found
  )
)
rem --- IMAGES ARE MANAGED DIRECTLY IN THE DEPLOY FOLDER. ---
rem --- This script does NOT copy or overwrite them, so your edits in
rem ---   %DEPLOY%\images  are preserved. ---
echo   (images in the deploy folder are left untouched)

echo.
echo Navigating to deploy folder...
cd /d "%DEPLOY%"
echo Current directory: %CD%

rem --- Confirm we are inside a git repository (git walks up to find .git) ---
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [ERROR] %DEPLOY% is not inside a git repository.
  echo The aperfectstorymap folder sits NEXT TO aperfectday - if your site
  echo repo is rooted at aperfectday, this new folder is outside it.
  echo Tell Claude and we adjust the deploy path or the repo.
  pause & exit /b 1
)

echo.
echo Staging changes in the Bath folder...
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
if "%commit_msg%"=="" set "commit_msg=Bath-Bristol: update story map demo"

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
echo   BATH COMMITTED ^& PUSHED!
echo ================================
echo.
echo Test online in a minute or two at:
echo   https://ludara.ai/aperfectstorymap/Bath-Bristol/
echo.
echo Remember: unlisted demo - share the URL only in pitch calls.
echo.
pause
endlocal
