@echo off
echo ================================
echo   Mexico City GIT COMMIT
echo ================================

set MEXICOCITY=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\thecuriousmexican\MexicoCity

echo.
echo Navigating to MEXICOCITY...
cd /d "%MEXICOCITY%"

echo Current directory: %CD%

echo.
echo Adding all changes MexicoCity...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=MexicoCity: Deploy.
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing MexicoCity to repository...
git push

echo.
echo ================================
echo   MEXICOCITY COMMITTED! 
echo ================================
echo.
echo ✅ MexicoCity changes committed and pushed
echo.
pause
