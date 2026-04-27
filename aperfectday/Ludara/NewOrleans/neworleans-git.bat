@echo off
echo ================================
echo   NEWORLEANS GIT COMMIT
echo ================================

set NEWORLEANS=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\Ludara\NEWORLEANS

echo.
echo Navigating to NEWORLEANS...
cd /d "%NEWORLEANS%"

echo Current directory: %CD%

echo.
echo Adding all changes in NEWORLEANS...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=NEWORLEANS: Updates and fixes
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing NEWORLEANS to repository...
git push

echo.
echo ================================
echo   NEWORLEANS COMMITTED!
echo ================================
echo.
echo ✅ NEWORLEANS changes committed and pushed
echo ✅ Ready for live deployment
echo.
pause
