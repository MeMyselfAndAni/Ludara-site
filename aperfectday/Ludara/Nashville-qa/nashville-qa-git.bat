@echo off
echo ================================
echo   NASHVILLE-QA GIT COMMIT
echo ================================

set NASHVILLE_QA=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\Ludara\Nashville-qa

echo.
echo Navigating to Nashville-qa...
cd /d "%NASHVILLE_QA%"

echo Current directory: %CD%

echo.
echo Adding all changes in Nashville-qa...
git add -A

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=Nashville-qa: Updates and fixes
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing Nashville-qa to repository...
git push

echo.
echo ================================
echo   NASHVILLE-QA COMMITTED!
echo ================================
echo.
echo ✅ Nashville-qa changes committed and pushed
echo ✅ Ready for live deployment
echo.
pause
