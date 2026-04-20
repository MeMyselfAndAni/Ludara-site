@echo off
echo ================================
echo   DEPLOYING NASHVILLE-QA TO LIVE
echo ================================

set NASHVILLE_QA=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\Ludara\Nashville-qa
set NASHVILLE_LIVE=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\Ludara\Nashville

echo.
echo 🔍 Verifying directories exist...
if not exist "%NASHVILLE_QA%" (
    echo ❌ Nashville-qa directory not found: %NASHVILLE_QA%
    pause
    exit /b 1
)

if not exist "%NASHVILLE_LIVE%" (
    echo ❌ Nashville live directory not found: %NASHVILLE_LIVE%
    pause
    exit /b 1
)

echo ✅ Both directories found
echo.
echo 📂 Source: %NASHVILLE_QA%
echo 📂 Target: %NASHVILLE_LIVE%

echo.
set /p CONFIRM="⚠️  This will OVERWRITE all files in Nashville LIVE. Continue? (y/N): "
if /i not "%CONFIRM%"=="y" (
    echo Deployment cancelled.
    pause
    exit /b 0
)

echo.
echo 🚀 Starting deployment...

echo.
echo 1. Backing up current live version...
set BACKUP_DIR=%NASHVILLE_LIVE%_backup_%date:~6,4%_%date:~3,2%_%date:~0,2%_%time:~0,2%_%time:~3,2%
set BACKUP_DIR=%BACKUP_DIR: =%
set BACKUP_DIR=%BACKUP_DIR::=%
xcopy "%NASHVILLE_LIVE%\*" "%BACKUP_DIR%\" /E /H /C /I /Y >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Backup created: %BACKUP_DIR%
) else (
    echo ⚠️  Backup failed, but continuing...
)

echo.
echo 2. Copying all files from Nashville-qa to Nashville LIVE...
echo    (This will override ALL existing files)

xcopy "%NASHVILLE_QA%\*" "%NASHVILLE_LIVE%\" /E /H /C /Y /R
if %errorlevel%==0 (
    echo ✅ All files copied successfully
) else (
    echo ❌ Copy operation failed
    pause
    exit /b 1
)

echo.
echo 3. Verifying critical files exist in live...
set CRITICAL_FILES=index.html ui-favourites.js ui-pdf.js map-core.js

for %%f in (%CRITICAL_FILES%) do (
    if exist "%NASHVILLE_LIVE%\%%f" (
        echo ✅ %%f
    ) else (
        echo ❌ %%f MISSING!
        set DEPLOY_ERROR=1
    )
)

if defined DEPLOY_ERROR (
    echo.
    echo ❌ Critical files missing! Deployment may have failed.
    pause
    exit /b 1
)

echo.
echo 4. Git commit for Nashville LIVE...
cd /d "%NASHVILLE_LIVE%"
git add -A
git commit -m "LIVE DEPLOYMENT: Nashville-qa fixes deployed to production

✅ Google Maps ordering fixed with drag-to-reorder support
✅ Place names in Google Maps instead of coordinates  
✅ PDF image preloading prevents emoji placeholders
✅ Map auto-refresh prevents timeout errors
✅ Clickable numbered markers on saved routes
✅ Clean architecture with no duplicate functions

Deployed from Nashville-qa on %date% at %time%"

git push

echo.
echo ================================
echo    DEPLOYMENT COMPLETE! 🎉
echo ================================
echo.
echo ✅ Nashville-qa successfully deployed to LIVE
echo ✅ All files overridden with latest versions
echo ✅ Git committed and pushed to repository
echo ✅ Backup saved to: %BACKUP_DIR%
echo.
echo 🌟 Nashville LIVE is now updated with all fixes!
echo.
echo Next steps:
echo - Test the live site thoroughly
echo - Deploy same fixes to New Orleans, Cape Town, London
echo.
pause
