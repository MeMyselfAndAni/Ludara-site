@echo off
echo ================================
echo   HolstonHouse GIT COMMIT
echo ================================

set HolstonHouse=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\HolstonHouse

echo.
echo Navigating to HolstonHouse...
cd /d "%HolstonHouse%"

echo Current directory: %CD%

echo.
echo Adding all changes in HolstonHouse...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=HolstonHouse: Updates and fixes
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing HolstonHouse to repository...
git push

echo.
echo ================================
echo   HolstonHouse COMMITTED!
echo ================================
echo.
echo ✅ HolstonHouse changes committed and pushed
echo ✅ Ready for live deployment
echo.
pause
