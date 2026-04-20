@echo off
setlocal
echo ================================
echo   SEOUL-QA GIT COMMIT
echo ================================

set SEOUL_QA=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\zenkimchi\Seoul-QA

echo.
echo Navigating to Seoul-QA...
cd /d "%SEOUL_QA%"
if errorlevel 1 (
    echo.
    echo ERROR: Could not cd to %SEOUL_QA%
    echo Folder may not exist or path is wrong.
    pause
    exit /b 1
)

echo Current directory: %CD%

echo.
echo Adding all changes in Seoul-QA...
git add .

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" set commit_msg=Seoul-QA update

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"
if errorlevel 1 (
    echo.
    echo ERROR: git commit failed. See above output.
    echo Common causes:
    echo   - Nothing to commit (index.html was not saved into Seoul-QA)
    echo   - Merge conflict or other git state issue
    pause
    exit /b 1
)

echo.
echo Pushing Seoul-QA to repository...
git push
if errorlevel 1 (
    echo.
    echo ERROR: git push failed. See above output.
    echo Common causes:
    echo   - Network / auth issue
    echo   - Remote has newer commits; run: git pull --rebase
    pause
    exit /b 1
)

echo.
echo ================================
echo   SEOUL-QA COMMITTED AND PUSHED
echo ================================
echo.
echo Ready for testing at:
echo   https://ludara.ai/aperfectday/zenkimchi/seoul-qa/
echo.
echo Allow ~30 seconds for GitHub Pages to rebuild.
echo.
pause
endlocal
