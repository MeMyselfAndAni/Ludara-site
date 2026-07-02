@echo off
REM ============================================================
REM  Commit & push ONLY this folder (HolyLandWithMaria).
REM  Place this folder inside your repo:
REM     C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\HolyLandWithMaria\
REM  Double-click to stage, commit and push just this directory.
REM ============================================================

cd /d "%~dp0"
echo Committing folder: %cd%
echo.

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo ERROR: This folder is not inside a git repository yet.
  echo Copy the HolyLandWithMaria folder into your Ludara-site repo first.
  pause
  exit /b 1
)

echo Changes in this folder:
git status --short .
echo.

REM Stage ONLY this directory (the trailing "." limits it to here and below)
git add .
git commit -m "Update Holy Land with Maria site (%date% %time%)" .
git push

echo.
echo ============================================================
echo  Done. If no errors above, ludara.ai/HolyLandWithMaria
echo  will update in 1-2 minutes.
echo ============================================================
pause
