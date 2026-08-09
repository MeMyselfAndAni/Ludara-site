@echo off
setlocal enabledelayedexpansion

set "REPO=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site"

echo ============================================
echo  Ludara site - commit and push EVERYTHING
echo ============================================
echo Repo: %REPO%
echo.
echo This stages every change in the repository: new files,
echo edits inside guide and map folders, and deletions.
echo The _to_delete folder is excluded by .gitignore.
echo.
echo Changed 2026-08-09. The old version staged only fifteen
echo hardcoded paths, so edits inside guide folders were
echo silently skipped while the script still reported success.
echo.

cd /d "%REPO%"
if errorlevel 1 (
  echo [ERROR] Could not change directory to %REPO%
  pause
  exit /b 1
)

if not exist ".git" (
  echo [ERROR] %REPO% is not a git repository ^(.git folder missing^).
  pause
  exit /b 1
)

git add -A
if errorlevel 1 (
  echo [ERROR] git add failed. Check for a stale .git\index.lock file.
  pause
  exit /b 1
)

echo.
echo --- Staged changes ---
git status --short
echo ----------------------
echo.

for /f %%i in ('git status --porcelain ^| findstr /b /c:"M " ^| find /c /v ""') do set "MODS=%%i"
for /f %%i in ('git status --porcelain ^| findstr /b /c:"A " ^| find /c /v ""') do set "ADDS=%%i"
for /f %%i in ('git status --porcelain ^| findstr /b /c:"D " ^| find /c /v ""') do set "DELS=%%i"

echo   modified : !MODS!
echo   added    : !ADDS!
echo   DELETED  : !DELS!
echo.

git diff --cached --quiet
if not errorlevel 1 (
  echo [info] No changes to commit. Exiting.
  pause
  exit /b 0
)

if !DELS! GTR 0 (
  echo ********************************************
  echo  WARNING: this commit REMOVES !DELS! file^(s^)
  echo  from the live site. Scroll up and read every
  echo  line that starts with D before continuing.
  echo ********************************************
  echo.
)

set "OK="
set /p "OK=Type YES to continue, anything else to abort: "
if /i not "!OK!"=="YES" (
  echo.
  echo Aborted. Nothing was committed and no file was changed.
  echo The changes are still staged. Run "git reset" to unstage them.
  pause
  exit /b 0
)

set "MSG="
set /p "MSG=Commit message ^(Enter for default^): "
if "!MSG!"=="" set "MSG=Update site %DATE% %TIME%"

git commit -m "!MSG!"
if errorlevel 1 (
  echo [ERROR] Commit failed.
  pause
  exit /b 1
)

echo.
echo Pushing to remote...
git push
if errorlevel 1 (
  echo.
  echo [ERROR] Push failed. Check your branch, remote, and credentials.
  pause
  exit /b 1
)

echo.
echo ============================================
echo  Done. Live in a minute or two.
echo ============================================
pause
endlocal
