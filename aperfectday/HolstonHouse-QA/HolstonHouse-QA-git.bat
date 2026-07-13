@echo off
echo ================================
echo   HolstonHouse-QA GIT COMMIT
echo ================================

set HolstonHouse=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\HolstonHouse-QA

echo.
echo Navigating to HolstonHouse-QA...
cd /d "%HolstonHouse%"

echo Current directory: %CD%

echo.
echo Adding all changes in HolstonHouse-QA...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=HolstonHouse-QA: Updates and fixes
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing HolstonHouse-QA to repository...
git push

echo.
echo ================================
echo   HolstonHouse-QA COMMITTED!
echo ================================
echo.
echo ✅ HolstonHouse-QA changes committed and pushed
echo ✅ Ready for live deployment
echo.
pause
