@echo off
echo ================================
echo   LONDON GIT COMMIT
echo ================================

set LONDON=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\Ludara\LONDON

echo.
echo Navigating to LONDON...
cd /d "%LONDON%"

echo Current directory: %CD%

echo.
echo Adding all changes in LONDON...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=LONDON: Updates and fixes
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing LONDON to repository...
git push

echo.
echo ================================
echo   LONDON COMMITTED!
echo ================================
echo.
echo ✅ LONDON changes committed and pushed
echo ✅ Ready for live deployment
echo.
pause
