@echo off
setlocal enabledelayedexpansion
echo =====================================
echo   SHANTARAM GIT COMMIT ^& DEPLOY
echo =====================================

rem  ------------------------------------------------------------------
rem  This script commits and pushes THE FOLDER IT SITS IN.
rem  There is no separate working copy any more. Edit the files here.
rem  Changed 2026-08-06: the old version copied from
rem    ...\Claude\Projects\A Perfect Day\...
rem  over this folder. A stale copy there silently reverted three weeks
rem  of work on 3 August, and it would have replaced the minimised MUZA
rem  images with the full size originals. Never reintroduce a copy step.
rem  Expected live URL after push:  https://ludara.ai/aperfectstorymap/shantaram/
rem  ------------------------------------------------------------------

pushd "%~dp0"
echo.
echo Folder: %CD%
echo.

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [ERROR] %CD% is not inside a git repository.
  popd & pause & exit /b 1
)

echo Staging changes in this folder...
git add .

echo.
echo Current status:
git status --short

git diff --cached --quiet
if not errorlevel 1 (
  echo.
  echo [info] No changes to commit. Exiting.
  popd & pause & exit /b 0
)

echo.
echo Read the list above before continuing.
echo Anything you did not expect means a file was edited in the wrong place.
echo Close this window to abort.
echo.
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set "commit_msg=Shantaram: update story map demo"

echo.
echo Committing: "%commit_msg%"
git commit -m "%commit_msg%"
if errorlevel 1 ( echo [ERROR] Commit failed. & popd & pause & exit /b 1 )

echo.
echo Pushing to repository...
git push
if errorlevel 1 (
  echo.
  echo [ERROR] Push failed. Check your branch, remote, and credentials.
  popd & pause & exit /b 1
)

echo.
echo =====================================
echo   SHANTARAM COMMITTED ^& PUSHED!
echo =====================================
echo.
echo Test online in a minute or two at:
echo   https://ludara.ai/aperfectstorymap/shantaram/
echo.
popd
pause
endlocal
