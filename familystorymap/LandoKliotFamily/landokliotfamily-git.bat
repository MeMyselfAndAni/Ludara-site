@echo off
setlocal enabledelayedexpansion
echo =====================================
echo   LANDO-KLIOT FAMILY MAP GIT COMMIT ^& DEPLOY
echo   (A Perfect Story Map - Family Edition)
echo =====================================

set "WORKING=C:\Users\Maria\OneDrive\Dokumentumok\Claude\Projects\A Perfect Day\familystorymap\LandoKliotFamily"
set "DEPLOY=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\familystorymap\landokliotfamily"
rem  Expected live URL after push:  https://ludara.ai/familystorymap/landokliotfamily/
rem  PRIVATE FAMILY EDITION: index.html carries noindex,nofollow.
rem  Do NOT link it from public pages - share the URL with family only.
rem  NOTE: mirrors inanasfootsteps-git.bat. If git reports "not inside a git
rem  repository" below, the repo root differs - tell Claude and we adjust.
rem  (If you'd rather serve it under /aperfectstorymap/, just change DEPLOY to
rem   ...\Ludara-site\aperfectstorymap\landokliotfamily and rerun.)

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
for %%F in (index.html data.js people.js map.js map-core.js ui-card.js ui-filter.js ui-stories.js ui-favourites.js ui-pdf.js ui-tree.js tutorial.js photos.js credits.js styles.css sw.js favicon.svg minimize-images.js) do (
  if exist "%WORKING%\%%F" (
    copy /Y "%WORKING%\%%F" "%DEPLOY%\%%F" >nul && echo   copied %%F
  ) else (
    echo   [skip] %%F not found
  )
)

echo.
echo Copying images (place-*.jpg, splash, og) into the live site...
if exist "%WORKING%\images\*.jpg" (
  copy /Y "%WORKING%\images\*.jpg" "%DEPLOY%\images\" >nul && echo   copied images\*.jpg
) else (
  echo   [skip] no images\*.jpg yet
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
echo Staging changes in the landokliotfamily folder...
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
if "%commit_msg%"=="" set "commit_msg=Lando-Kliot family map: update map and tree"

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
echo =====================================
echo   LANDO-KLIOT FAMILY MAP COMMITTED ^& PUSHED!
echo =====================================
echo.
echo Test online in a minute or two at:
echo   https://ludara.ai/familystorymap/landokliotfamily/
echo.
echo This is the PRIVATE family edition - share the URL with family only.
echo.
pause
endlocal
