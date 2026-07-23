@echo off
setlocal
echo ============================================================
echo   REMOVE the mistaken "plovdiv" folder from the live site
echo   The old deploy pushed the guide to aperfectday\plovdiv.
echo   The guide now lives at aperfectday\Evmolpia, so this
echo   removes the leftover plovdiv folder from git + the website.
echo   Run this ONCE.
echo ============================================================
echo.

set "APERFECTDAY=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday"

if not exist "%APERFECTDAY%" (
  echo [ERROR] Cannot find %APERFECTDAY%
  echo Tell Claude the correct path and we adjust.
  pause & exit /b 1
)

cd /d "%APERFECTDAY%"

rem --- Confirm we are inside a git repository (git walks up to find .git) ---
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [ERROR] %APERFECTDAY% is not inside a git repository.
  echo Open the folder that contains your .git and rerun, or tell Claude.
  pause & exit /b 1
)

echo Files git is currently tracking under "plovdiv":
git ls-files plovdiv
echo.
echo This will DELETE the plovdiv folder and remove it from the live site.
echo (Your aperfectday\Evmolpia folder is NOT touched.)
echo.
set /p ok="Type YES to remove plovdiv and push: "
if /I not "%ok%"=="YES" (
  echo Aborted. Nothing was changed or pushed.
  pause & exit /b 0
)

rem --- Untrack (keep files), delete locally, then stage the removal ---
git rm -r --cached plovdiv >nul 2>&1
if exist "plovdiv" rmdir /s /q "plovdiv"
git add -A plovdiv

echo.
echo Staged changes:
git status --short
echo.

git diff --cached --quiet
if not errorlevel 1 (
  echo [info] Nothing to remove ^(plovdiv not in the repo^). Exiting.
  pause & exit /b 0
)

echo Committing removal...
git commit -m "Remove mistaken plovdiv folder (guide moved to aperfectday/Evmolpia)"
if errorlevel 1 ( echo [ERROR] Commit failed. & pause & exit /b 1 )

echo.
echo Pushing...
git push
if errorlevel 1 (
  echo.
  echo [ERROR] Push failed. Check your branch, remote, and credentials.
  pause & exit /b 1
)

echo.
echo ============================================================
echo   Done. plovdiv will disappear from ludara.ai/aperfectday/
echo   within a minute or two.
echo ============================================================
pause
endlocal
