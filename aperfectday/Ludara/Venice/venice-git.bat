@echo off
echo ================================
echo   VENICE GIT COMMIT
echo ================================

set VENICE=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\Ludara\VENICE

echo.
echo Navigating to VENICE...
cd /d "%VENICE%"

echo Current directory: %CD%

echo.
echo Adding all changes in VENICE...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=VENICE: Updates and fixes
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing VENICE to repository...
git push

echo.
echo ================================
echo   VENICE COMMITTED!
echo ================================
echo.
echo ✅ VENICE changes committed and pushed
echo ✅ Ready for live deployment
echo.
pause
