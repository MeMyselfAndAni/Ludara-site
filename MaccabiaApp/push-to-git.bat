@echo off
setlocal enabledelayedexpansion

set "REPO=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site"

echo ============================================
echo  Ludara - push MaccabiaApp ONLY
echo ============================================
echo Repo: %REPO%
echo.
echo Files that will be committed if changed:
echo   MaccabiaApp\index.html
echo   MaccabiaApp\parade.webp
echo   MaccabiaApp\favicon.svg
echo.
echo Nothing outside the MaccabiaApp folder will be touched.
echo.

cd /d "%REPO%"
if errorlevel 1 (
  echo [ERROR] Could not change directory to %REPO%
  pause
  exit /b 1
)

if not exist ".git" (
  echo [ERROR] %REPO% is not a git repository - .git folder missing.
  pause
  exit /b 1
)

set "FILES=MaccabiaApp\index.html MaccabiaApp\parade.webp MaccabiaApp\favicon.svg"

set "MISSING="
for %%F in (%FILES%) do (
  if not exist "%%F" set "MISSING=!MISSING! %%F"
)
if not "!MISSING!"=="" (
  echo [WARN] Missing and skipped:!MISSING!
  echo.
)

rem --- Stage ONLY the MaccabiaApp files listed above ---
for %%F in (%FILES%) do (
  if exist "%%F" git add -- "%%F"
)

echo.
echo --- Staged changes ---
git status --short
echo ----------------------
echo.

git diff --cached --quiet
if not errorlevel 1 (
  echo [info] No changes to commit. Exiting.
  pause
  exit /b 0
)

set "MSG="
set /p "MSG=Commit message [Enter for default]: "
if "!MSG!"=="" set "MSG=Update MaccabiaApp %DATE% %TIME%"

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
  echo [ERROR] Push failed. Check branch, remote, and credentials.
  pause
  exit /b 1
)

echo.
echo ============================================
echo  Done. Published MaccabiaApp.
echo ============================================
pause
endlocal
