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
echo   hotels.html
echo   museums.html
echo   realestate.html
echo   universities.html
echo   familystorymap\index.html
echo   aperfectday\index.html
echo   aperfectstorymap\index.html
echo   aperfectstorymap\screen.html
echo   sitemap.xml
echo   robots.txt
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
for %%F in (index.html contact.html product.html about.html hotels.html museums.html realestate.html universities.html familystorymap\index.html aperfectday\index.html aperfectstorymap\index.html aperfectstorymap\screen.html sitemap.xml robots.txt assets) do (
  if not exist "%%F" set "MISSING=!MISSING! %%F"
)
if not "!MISSING!"=="" (
  echo [WARN] These files are missing and will be skipped:!MISSING!
  echo.
)

rem --- Stage ONLY the listed files ---
for %%F in (index.html contact.html product.html about.html hotels.html museums.html realestate.html universities.html familystorymap\index.html aperfectday\index.html aperfectstorymap\index.html aperfectstorymap\screen.html sitemap.xml robots.txt assets) do (
  rem  -A stages additions, modifications AND deletions for this exact path,
  rem  so retiring a page (e.g. universities.html) is committed rather than skipped.
  git add -A -- "%%F" >nul 2>&1
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
