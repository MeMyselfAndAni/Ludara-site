@echo off
:: ─────────────────────────────────────────────────────────────────────
:: deploy-wanderlush.bat — Deploy WanderLush Tbilisi Guide to ludara.ai
:: Run from the folder containing index.html, styles.css etc.
:: ─────────────────────────────────────────────────────────────────────

set REPO_DIR=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
set DEPLOY_DIR=%REPO_DIR%\aperfectday\wanderlush\tbilisi

echo.
echo ═══════════════════════════════════════════════════
echo   Deploying WanderLush Tbilisi Guide
echo   Target: ludara.ai/aperfectday/wanderlush/tbilisi
echo ═══════════════════════════════════════════════════
echo.

if not exist "%REPO_DIR%\.git" (
  echo ERROR: Git repo not found at %REPO_DIR%
  pause & exit /b 1
)

if not exist "%DEPLOY_DIR%" mkdir "%DEPLOY_DIR%"

:: ── Copy all files straight — no version stamping needed ──
echo Copying files...
for %%F in (index.html styles.css data.js photos.js map.js ui-card.js ui-filter.js ui-stories.js ui-favourites.js ui-pdf.js) do (
  if exist "%%F" (
    copy /Y "%%F" "%DEPLOY_DIR%\%%F" >nul
    echo   + %%F
  ) else (
    echo   MISSING: %%F
  )
)

:: Copy pitch page
if not exist "%REPO_DIR%\aperfectday\wanderlush\pitch" mkdir "%REPO_DIR%\aperfectday\wanderlush\pitch"
if exist "emily-pitch.html" (
  copy /Y "emily-pitch.html" "%REPO_DIR%\aperfectday\wanderlush\pitch\index.html" >nul
  echo   + emily-pitch.html
)

:: ── Git: stage, commit with timestamp, push ──
cd /d "%REPO_DIR%"
git add aperfectday\wanderlush\

:: Timestamp in commit message forces GitHub Pages to redeploy
set TS=%DATE% %TIME%
git commit -m "WanderLush deploy %TS%"
git push

echo.
echo ═══════════════════════════════════════════════════
echo   Done! https://ludara.ai/aperfectday/wanderlush/tbilisi
echo   Wait 30-60 seconds then Ctrl+Shift+R to reload
echo ═══════════════════════════════════════════════════
echo.
pause
