@echo off
setlocal enabledelayedexpansion
echo =====================================
echo   RAMAT HASHARON GIT COMMIT ^& DEPLOY
echo =====================================

rem  ------------------------------------------------------------------
rem  This script commits and pushes THE FOLDER IT SITS IN.
rem  There is no separate working copy. Edit the files here.
rem  Created 2026-09-08 so this map can be deployed on its own, as the
rem  quiet test bed for changes before they go to the live guides.
rem  Expected live URL after push:  https://ludara.ai/aperfectday/ludara/ramathasharon/
rem  This map carries noindex,nofollow and is not in sitemap.xml.
rem  ------------------------------------------------------------------

pushd "%~dp0"
echo.
echo Folder: %CD%
echo.

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [ERROR] %CD% is not inside a git repository.
  popd ^& pause ^& exit /b 1
)

echo Staging changes in this folder...
git add .

echo.
echo Current status:
git status --short .

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Ramat HaSharon: updates

echo.
echo Committing: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing...
git push

echo.
echo =====================================
echo   RAMAT HASHARON DONE
echo =====================================
echo.
pause
popd
