@echo off
echo ================================
echo   BANGKOK GIT COMMIT
echo ================================

set BANGKOK=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\nomadicmatt\BANGKOK

echo.
echo Navigating to ...
cd /d "%BANGKOK%"

echo Current directory: %CD%

echo.
echo Adding all changes in ...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=BANGKOK: Deploy.
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing to repository...
git push

echo.
echo ================================
echo   COMMITTED!
echo ================================
echo.
echo ✅ Changes committed and pushed
echo.
pause
