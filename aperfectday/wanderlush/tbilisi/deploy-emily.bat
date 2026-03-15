@echo off
:: ─────────────────────────────────────────────────────────────────────
:: deploy-emily.bat  —  Deploy Emily Tbilisi Guide to ludara.ai
:: Run from: C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
:: ─────────────────────────────────────────────────────────────────────

set REPO_DIR=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
set DEPLOY_DIR=%REPO_DIR%\aperfectday\emily

echo.
echo ═══════════════════════════════════════════════
echo   Deploying Emily Tbilisi Guide + Pitch Page
echo   Target: ludara.ai/aperfectday/emily
echo ═══════════════════════════════════════════════
echo.

:: Check we're in the right place
if not exist "%REPO_DIR%\.git" (
  echo ERROR: Git repo not found at %REPO_DIR%
  echo Please check the REPO_DIR path in this script.
  pause
  exit /b 1
)

:: Check deploy folder exists
if not exist "%DEPLOY_DIR%" (
  echo Creating deploy folder...
  mkdir "%DEPLOY_DIR%"
)

:: Copy all 9 files
echo Copying files...
for %%F in (index.html styles.css data.js photos.js map.js ui-filter.js ui-stories.js ui-favourites.js ui-pdf.js) do (
  if exist "%%F" (
    copy /Y "%%F" "%DEPLOY_DIR%\%%F" >nul
    echo   ✓ %%F
  ) else (
    echo   ✗ %%F NOT FOUND — make sure you run this bat from the folder containing all 7 files
  )
)

:: Copy pitch page to /pitch/emily/
if not exist "%REPO_DIR%\pitch\emily" mkdir "%REPO_DIR%\pitch\emily"
if exist "emily-pitch.html" (
  copy /Y "emily-pitch.html" "%REPO_DIR%\pitch\emily\index.html" >nul
  echo   ✓ emily-pitch.html → pitch/emily/index.html
)

:: Git add, commit, push
cd /d "%REPO_DIR%"
echo.
echo Running git add...
git add aperfectday/emily/
git add pitch/emily/

echo Running git commit...
git commit -m "Update Emily Tbilisi guide - %DATE% %TIME%"

echo Running git push...
git push

echo.
echo ═══════════════════════════════════════════════
echo   Done! Live at: https://ludara.ai/aperfectday/emily
echo   (allow 30-60 seconds for GitHub Pages to update)
echo ═══════════════════════════════════════════════
echo.
pause
