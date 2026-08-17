@echo off
echo ================================
echo   Holston-QA GIT COMMIT
echo ================================

set HolstonQA=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\Holston-QA

echo.
echo Navigating to Holston-QA...
cd /d "%HolstonQA%"

echo Current directory: %CD%

echo.
echo Adding all changes in Holston-QA...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=Holston-QA: Updates and fixes
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing Holston-QA to repository...
git push

echo.
echo ================================
echo   Holston-QA COMMITTED!
echo ================================
echo.
echo Holston-QA changes committed and pushed
echo Live at: https://ludara.ai/aperfectday/Holston-QA/
echo.
pause
