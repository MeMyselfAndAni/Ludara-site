@echo off
echo ================================
echo   CAPE TOWN GIT COMMIT
echo ================================

set CAPETOWN=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\drizzleanddip\CapeTown

echo.
echo Navigating to Cape Town...
cd /d "%CAPETOWN%"

echo Current directory: %CD%

echo.
echo Adding all changes in Cape Town...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=Cape Town: Deploy.
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing Cape Town to repository...
git push

echo.
echo ================================
echo   CAPE TOWN COMMITTED! 🇿🇦
echo ================================
echo.
echo ✅ Cape Town changes committed and pushed
echo.
pause
