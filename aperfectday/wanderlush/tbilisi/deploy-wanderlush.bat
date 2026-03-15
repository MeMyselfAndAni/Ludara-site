@echo off
:: ─────────────────────────────────────────────────────────────────────
:: deploy-wanderlush.bat — Deploy WanderLush Tbilisi Guide to ludara.ai
:: Run from: C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
:: ─────────────────────────────────────────────────────────────────────

set REPO_DIR=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
set DEPLOY_DIR=%REPO_DIR%\aperfectday\wanderlush\tbilisi

echo.
echo ═══════════════════════════════════════════════
echo   Deploying WanderLush Tbilisi Guide
echo   Target: ludara.ai/aperfectday/wanderlush/tbilisi
echo ═══════════════════════════════════════════════
echo.

:: Check we're in the right place
if not exist "%REPO_DIR%\.git" (
  echo ERROR: Git repo not found at %REPO_DIR%
  pause
  exit /b 1
)

:: Create deploy folder if needed
if not exist "%DEPLOY_DIR%" (
  echo Creating deploy folder...
  mkdir "%DEPLOY_DIR%"
)

:: ── Generate timestamp version string (MMDDHHMMSS) ──
:: This forces Chrome to reload all files on every deploy
for /f "tokens=1-5 delims=/:. " %%a in ("%DATE% %TIME%") do (
  set V=%%c%%b%%a%%d%%e
)
:: Remove any spaces from the version
set V=%V: =%
echo Version stamp: %V%

:: ── Stamp the version into index.html then copy ──
echo Stamping version into index.html...
powershell -Command "(Get-Content 'index.html') -replace '\?v=BUILD', ('?v=' + '%V%') | Set-Content '_index_deploy.html'"

:: Copy stamped index.html
copy /Y "_index_deploy.html" "%DEPLOY_DIR%\index.html" >nul
del "_index_deploy.html"
echo   ✓ index.html (v=%V%)

:: Copy all other files unchanged
for %%F in (styles.css data.js photos.js map.js ui-card.js ui-filter.js ui-stories.js ui-favourites.js ui-pdf.js) do (
  if exist "%%F" (
    copy /Y "%%F" "%DEPLOY_DIR%\%%F" >nul
    echo   ✓ %%F
  ) else (
    echo   ✗ %%F NOT FOUND
  )
)

:: Copy pitch page
if not exist "%REPO_DIR%\aperfectday\wanderlush\pitch" mkdir "%REPO_DIR%\aperfectday\wanderlush\pitch"
if exist "emily-pitch.html" (
  copy /Y "emily-pitch.html" "%REPO_DIR%\aperfectday\wanderlush\pitch\index.html" >nul
  echo   ✓ emily-pitch.html → wanderlush/pitch/index.html
)

:: Git add, commit, push
cd /d "%REPO_DIR%"
echo.
echo Running git...
git add aperfectday/wanderlush/
git commit -m "Deploy WanderLush Tbilisi v%V%"
git push

echo.
echo ═══════════════════════════════════════════════
echo   Done! Live at: https://ludara.ai/aperfectday/wanderlush/tbilisi
echo   Chrome cache busted with v=%V%
echo   (allow 30-60 seconds for GitHub Pages)
echo ═══════════════════════════════════════════════
echo.
pause
