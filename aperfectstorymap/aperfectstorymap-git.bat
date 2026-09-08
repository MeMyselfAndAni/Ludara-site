@echo off
setlocal enabledelayedexpansion
echo ==========================================
echo   A PERFECT STORY MAP: DEPLOY ^& COMMIT
echo   (landing page + assets + demos)
echo ==========================================

rem  ------------------------------------------------------------------
rem  This script commits and pushes THE FOLDER IT SITS IN.
rem  There is no separate working copy any more. Edit the files here.
rem  Changed 2026-08-06: the old version copied index.html and the
rem  Shantaram demo from the Claude Projects folder over this one.
rem  A stale copy there silently reverted three weeks of work on
rem  3 August. Never reintroduce a copy step.
rem  Live URLs after push:
rem    https://ludara.ai/aperfectstorymap/            (landing page)
rem    https://ludara.ai/aperfectstorymap/shantaram/       (public demo, linked from the landing page)
rem    https://ludara.ai/aperfectstorymap/bookoflongings/  (public demo, linked from the landing page)
rem  Both demos are public: they are listed in sitemap.xml, they carry no noindex,
rem  and the landing page links them from the "See a real one" section. The old
rem  "never link publicly" note was stale and was removed on 8 September 2026.
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

echo Staging all changes under aperfectstorymap...
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
if "%commit_msg%"=="" set "commit_msg=StoryMap: update landing + Shantaram demo"

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
echo ==========================================
echo   STORY MAP DEPLOYED!
echo ==========================================
echo.
echo Landing:  https://ludara.ai/aperfectstorymap/
echo Demos:    /shantaram/  and  /bookoflongings/   (both public)
echo.
popd
pause
endlocal
