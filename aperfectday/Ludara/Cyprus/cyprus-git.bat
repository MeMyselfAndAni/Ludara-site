@echo off
echo ================================
echo   CYPRUS GIT COMMIT
echo ================================

set CYPRUS=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\Ludara\CYPRUS

echo.
echo Navigating to CYPRUS...
cd /d "%CYPRUS%"

echo Current directory: %CD%

echo.
echo Adding all changes in CYPRUS...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=CYPRUS: Updates and fixes
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing CYPRUS to repository...
git push

echo.
echo ================================
echo   CYPRUS COMMITTED!
echo ================================
echo.
echo ✅ CYPRUS changes committed and pushed
echo ✅ Ready for live deployment
echo.
pause
