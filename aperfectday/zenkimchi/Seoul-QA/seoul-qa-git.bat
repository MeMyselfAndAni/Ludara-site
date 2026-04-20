@echo off
setlocal
echo ================================
echo   SEOUL-QA GIT COMMIT
echo ================================

set SEOUL_QA=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\zenkimchi\Seoul-QA

echo.
echo Navigating to Seoul-QA...
cd /d "%SEOUL_QA%"
if errorlevel 1 goto err_cd

echo Current directory: %CD%

echo.
echo Adding all changes in Seoul-QA...
git add .

echo.
echo Current status - Seoul-QA only:
git status --short .

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" set commit_msg=Seoul-QA update

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"
if errorlevel 1 goto err_commit

echo.
echo Pushing Seoul-QA to repository...
git push
if errorlevel 1 goto err_push

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
exit /b 0


:err_cd
echo.
echo ERROR: Could not cd to Seoul-QA.
echo Folder may not exist or path is wrong.
echo Expected: %SEOUL_QA%
pause
exit /b 1

:err_commit
echo.
echo ERROR: git commit failed. See above output.
echo Common causes:
echo   - Nothing to commit. index.html was not saved into Seoul-QA.
echo   - Merge conflict or other git state issue.
pause
exit /b 1

:err_push
echo.
echo ERROR: git push failed. See above output.
echo Common causes:
echo   - Network or authentication issue.
echo   - Remote has newer commits. Try: git pull --rebase
pause
exit /b 1
