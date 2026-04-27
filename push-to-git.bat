@echo off
setlocal enabledelayedexpansion

set "REPO=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site"

echo ============================================
echo  Ludara site - push selected files only
echo ============================================
echo Repo: %REPO%
echo.
echo Files that will be committed ^(if changed^):
echo   index.html
echo   contact.html
echo   product.html
echo   about.html
echo   aperfectday\index.html
echo	assets\
echo.
echo Nothing else in the repo will be touched.
echo.

cd /d "%REPO%"
if errorlevel 1 (
  echo [ERROR] Could not change directory to %REPO%
  pause
  exit /b 1
)

if not exist ".git" (
  echo [ERROR] %REPO% is not a git repository ^(.git folder missing^).
  echo Run ^"git init^" there first, or clone the repo into it.
  pause
  exit /b 1
)

rem --- Verify each file exists before staging ---
set "MISSING="
for %%F in (index.html contact.html product.html about.html aperfectday\index.html  assets) do (
  if not exist "%%F" set "MISSING=!MISSING! %%F"
)
if not "!MISSING!"=="" (
  echo [WARN] These files are missing and will be skipped:!MISSING!
  echo.
)

rem --- Stage ONLY the listed files ---
for %%F in (index.html contact.html product.html about.html aperfectday\index.html assets) do (
  if exist "%%F" git add -- "%%F"
)

echo.
echo --- Staged changes ---
git status --short
echo ----------------------
echo.

rem --- If nothing is staged, bail out cleanly ---
git diff --cached --quiet
if not errorlevel 1 (
  echo [info] No changes to commit. Exiting.
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
echo  Done.
echo ============================================
pause
endlocal
