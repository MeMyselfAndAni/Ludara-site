@echo off
setlocal enabledelayedexpansion
echo ==========================================
echo   A PERFECT STORY MAP - DEPLOY ^& COMMIT
echo   (landing page + assets + Shantaram demo)
echo ==========================================

set "WORK=C:\Users\Maria\OneDrive\Dokumentumok\Claude\Projects\A Perfect Day\aperfectstorymap"
set "DEPLOY=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectstorymap"
rem  Live URLs after push:
rem    https://ludara.ai/aperfectstorymap/            (landing page)
rem    https://ludara.ai/aperfectstorymap/shantaram/  (unlisted demo - never link publicly)

echo.
echo Working copy : %WORK%
echo Deploy folder: %DEPLOY%
echo.

if not exist "%WORK%\index.html" (
  echo [ERROR] Working copy not found at %WORK%
  pause & exit /b 1
)

if not exist "%DEPLOY%" mkdir "%DEPLOY%"
if not exist "%DEPLOY%\assets" mkdir "%DEPLOY%\assets"
if not exist "%DEPLOY%\Shantaram" mkdir "%DEPLOY%\Shantaram"
if not exist "%DEPLOY%\Shantaram\images" mkdir "%DEPLOY%\Shantaram\images"

echo Copying landing page...
copy /Y "%WORK%\index.html" "%DEPLOY%\index.html" >nul && echo   copied index.html

rem Assets are managed manually in the deploy folder (Maria, 2026-07-08).
rem This script does NOT copy or overwrite anything in %DEPLOY%\assets.
echo   assets folder left untouched, managed manually

echo Copying Shantaram demo files...
for %%F in (index.html data.js map.js map-core.js ui-card.js ui-filter.js ui-stories.js ui-favourites.js ui-pdf.js tutorial.js photos.js credits.js styles.css sw.js favicon.svg minimize-images.js) do (
  if exist "%WORK%\Shantaram\%%F" (
    copy /Y "%WORK%\Shantaram\%%F" "%DEPLOY%\Shantaram\%%F" >nul && echo   copied Shantaram\%%F
  ) else (
    echo   [skip] Shantaram\%%F not found
  )
)
rem --- Demo images are managed directly in the deploy folder and left untouched,
rem --- EXCEPT on first deploy: if the deploy images folder is empty, seed it.
dir /b "%DEPLOY%\Shantaram\images\*.jpg" >nul 2>&1
if errorlevel 1 (
  echo Seeding demo images, first deploy...
  copy /Y "%WORK%\Shantaram\images\*.jpg" "%DEPLOY%\Shantaram\images\" >nul && echo   copied Shantaram\images\*
) else (
  echo   deploy demo images left untouched
)

echo.
echo Navigating to deploy folder...
cd /d "%DEPLOY%"
echo Current directory: %CD%

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [ERROR] %DEPLOY% is not inside a git repository.
  echo If your site repo is rooted at aperfectday, this folder is outside it.
  echo Tell Claude and we adjust.
  pause & exit /b 1
)

echo.
echo Staging all changes under aperfectstorymap...
git add .

echo.
echo Current status:
git status --short

git diff --cached --quiet
if not errorlevel 1 (
  echo.
  echo [info] No changes to commit. Exiting.
  pause & exit /b 0
)

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set "commit_msg=StoryMap: update landing + Shantaram demo"

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
echo ==========================================
echo   STORY MAP DEPLOYED!
echo ==========================================
echo.
echo Landing:  https://ludara.ai/aperfectstorymap/
echo Demo:     https://ludara.ai/aperfectstorymap/shantaram/  (unlisted)
echo.
pause
endlocal
