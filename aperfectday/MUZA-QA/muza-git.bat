@echo off
setlocal enabledelayedexpansion
echo ================================
echo   MUZA-QA GIT COMMIT ^& DEPLOY
echo ================================

set "DEPLOY=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\MUZA-QA"
rem  Expected live URL after push:  https://ludara.ai/aperfectday/MUZA-QA/

echo.
echo Deploy folder: %DEPLOY%
echo.


echo.
echo Navigating to deploy folder...
cd /d "%DEPLOY%"
echo Current directory: %CD%

rem --- Confirm we are inside a git repository (git walks up to find .git) ---
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [ERROR] %DEPLOY% is not inside a git repository.
  echo Make sure the aperfectday site repo is cloned/initialised.
  pause & exit /b 1
)

echo.
echo Staging changes in the MUZA-QA folder...
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
if "%commit_msg%"=="" set "commit_msg=MUZA-QA: update museum guide"

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
echo   MUZA-QA COMMITTED ^& PUSHED!
echo ================================
echo.
echo Test online in a minute or two at:
echo   https://ludara.ai/aperfectday/MUZA-QA/
echo.
pause
endlocal
