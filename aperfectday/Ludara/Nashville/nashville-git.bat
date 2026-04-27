@echo off
echo ================================
echo   NASHVILLE GIT COMMIT
echo ================================

set NASHVILLE=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\Ludara\Nashville

echo.
echo Navigating to Nashville...
cd /d "%NASHVILLE%"

echo Current directory: %CD%

echo.
echo Adding all changes in Nashville...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=Nashville: Updates and fixes
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing Nashville to repository...
git push

echo.
echo ================================
echo   NASHVILLE COMMITTED!
echo ================================
echo.
echo ✅ Nashville changes committed and pushed
echo ✅ Ready for live deployment
echo.
pause
