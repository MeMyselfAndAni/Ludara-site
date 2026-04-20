@echo off
setlocal
echo ================================
echo   SEOUL LIVE GIT COMMIT
echo ================================

set SEOUL=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\zenkimchi\Seoul

echo.
echo Navigating to Seoul...
cd /d "%SEOUL%"
if errorlevel 1 goto err_cd

echo Current directory: %CD%

echo.
echo Adding all changes in Seoul...
git add .

echo.
echo Current status - Seoul only:
git status --short .

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" set commit_msg=Seoul: promote from Seoul-QA

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"
if errorlevel 1 goto err_commit

echo.
echo Pushing Seoul to repository...
git push
if errorlevel 1 goto err_push

echo.
echo ================================
echo   SEOUL LIVE COMMITTED AND PUSHED
echo ================================
echo.
echo Live at:
echo   https://ludara.ai/aperfectday/zenkimchi/Seoul/
echo.
echo Allow ~30 seconds for GitHub Pages to rebuild.
echo.
echo REMINDER: this is the live URL sent to hotels. Verify it loads before sending tomorrow's emails.
echo.
pause
endlocal
exit /b 0


:err_cd
echo.
echo ERROR: Could not cd to Seoul.
echo Folder may not exist or path is wrong.
echo Expected: %SEOUL%
pause
exit /b 1

:err_commit
echo.
echo ERROR: git commit failed. See above output.
echo Common causes:
echo   - Nothing to commit. Seoul-QA files were not copied into Seoul folder.
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
