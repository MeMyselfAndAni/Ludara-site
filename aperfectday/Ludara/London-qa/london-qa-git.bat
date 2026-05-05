@echo off
echo ================================
echo   LONDON-QA GIT COMMIT
echo ================================

set LONDON-QA=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\Ludara\LONDON-QA

echo.
echo Navigating to LONDON-QA...
cd /d "%LONDON-QA%"

echo Current directory: %CD%

echo.
echo Adding all changes in LONDON-QA...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=LONDON-QA: Updates and fixes
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing LONDON-QA to repository...
git push

echo.
echo ================================
echo   LONDON-QA COMMITTED!
echo ================================
echo.
echo ✅ LONDON-QA changes committed and pushed
echo ✅ Ready for live deployment
echo.
pause
