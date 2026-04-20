@echo off
echo ================================
echo   CAPE TOWN-QA GIT COMMIT
echo ================================

set CAPETOWN_QA=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\drizzleanddip\CapeTown-qa

echo.
echo Navigating to Cape Town-qa...
cd /d "%CAPETOWN_QA%"

echo Current directory: %CD%

echo.
echo Adding all changes in Cape Town-qa...
git add -A

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=Cape Town-qa: Deploy Nashville fixes and improvements

✅ Google Maps ordering with drag-to-reorder support
✅ Place names in Google Maps instead of coordinates
✅ PDF image preloading prevents emoji placeholders  
✅ Map auto-refresh prevents timeout errors
✅ Clickable numbered markers on saved routes
✅ Clean architecture with no duplicate functions
✅ Metric units and 24-hour time format
✅ Cape Town branding and localization

Ready for testing and deployment to Cape Town live.
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing Cape Town-qa to repository...
git push

echo.
echo ================================
echo   CAPE TOWN-QA COMMITTED! 🇿🇦
echo ================================
echo.
echo ✅ Cape Town-qa changes committed and pushed
echo ✅ All Nashville fixes applied to Cape Town
echo ✅ Ready for testing at: https://ludara.ai/aperfectday/drizzleanddip/capetown-qa/
echo.
echo Next steps:
echo 1. Test Cape Town-qa thoroughly  
echo 2. Deploy Cape Town-qa → Cape Town live
echo 3. Apply same process to New Orleans and London
echo.
pause
