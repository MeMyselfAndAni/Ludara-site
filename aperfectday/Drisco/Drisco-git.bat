@echo off
echo ================================
echo   Drisco GIT COMMIT
echo ================================

set Drisco=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\Drisco

echo.
echo Navigating to Drisco...
cd /d "%Drisco%"

echo Current directory: %CD%

echo.
echo Adding all changes in Drisco...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=Drisco: Updates and fixes
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing Drisco to repository...
git push

echo.
echo ================================
echo   Drisco COMMITTED!
echo ================================
echo.
echo Drisco changes committed and pushed
echo Ready for live deployment
echo.
pause
