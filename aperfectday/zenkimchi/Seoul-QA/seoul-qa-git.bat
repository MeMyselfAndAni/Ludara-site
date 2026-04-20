@echo off
echo ================================
echo   SEOUL-QA GIT COMMIT
echo ================================

set SEOUL_QA=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\zenkimchi\Seoul-QA

echo.
echo Navigating to Seoul-QA...
cd /d "%SEOUL_QA%"

echo Current directory: %CD%

echo.
echo Adding all changes in Seoul-QA...
git add -A

echo.
echo Current status:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=Seoul-QA: Port Cape Town index structure to ZenKimchi/Seoul guide

Korean red branding (#c8102e) + ZenKimchi / Joe McPherson copy preserved
Seoul's 7 neighbourhoods: Mapo, Hongdae, Jongno, Euljiro, Itaewon, Gangnam, Noryangjin
Seoul's 5 categories: Restaurants, Chicken and Bars, Markets, Cafes, Experiences
Defensive nbhd-hider matches Seoul's nbhd-mapo data format
Share/URL itinerary loader + saved panel + drag-to-reorder inherited from Cape Town
Known bugs preserved for phase 2 cleanup (Nashville hardcode, duplicate renderList, debug logs)

Ready for testing; bug cleanup pass to follow.
)

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing Seoul-QA to repository...
git push

echo.
echo ================================
echo   SEOUL-QA COMMITTED! 🇰🇷
echo ================================
echo.
echo Seoul-QA changes committed and pushed
echo Cape Town index structure applied to Seoul (ZenKimchi branding preserved)
echo Ready for testing at: https://ludara.ai/aperfectday/zenkimchi/seoul-qa/
echo.
echo Next steps:
echo 1. Test Seoul-QA thoroughly
echo 2. Phase 2: clean up inherited bugs (Nashville hardcode, debug logs, duplicate renderList)
echo 3. Deploy Seoul-QA to Seoul live
echo.
pause
