@echo off
echo ================================
echo   HolyLandWithMaria GIT COMMIT
echo ================================

set HolyLandWithMaria=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\HolyLandWithMaria

echo.
echo Navigating to HolyLandWithMaria
cd /d "%HolyLandWithMaria%"

echo Current directory: %CD%

echo.
echo Adding all changes in HolyLandWithMaria...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=HolyLandWithMaria: Updates and fixes
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing HolyLandWithMaria to repository...
git push

echo.
echo ================================
echo   HolyLandWithMaria COMMITTED!
echo ================================
echo.
echo ✅ HolyLandWithMaria changes committed and pushed
echo ✅ Ready for live deployment
echo.
pause
