@echo off
set ROOT=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
set PLATFORM=%ROOT%\aperfectday\general\_platform
set GUIDE=%ROOT%\aperfectday\wanderlush\tbilisi

echo.
echo Deploying: WanderLush / Tbilisi
echo.

:: Clean and copy platform files
for %%F in (ui-card.js ui-filter.js ui-stories.js ui-favourites.js ui-pdf.js photos.js styles.css) do (
  if exist "%GUIDE%\%%F" del "%GUIDE%\%%F" >nul
  copy /Y "%PLATFORM%\%%F" "%GUIDE%\%%F" >nul
  echo   + %%F
)

:: Git — force add images and all guide files
cd /d "%ROOT%"
git add -f aperfectday/wanderlush/tbilisi/images/
git add aperfectday/wanderlush/tbilisi/
git commit -m "Deploy wanderlush/tbilisi %DATE% %TIME%"
git push

echo.
echo Done: https://ludara.ai/aperfectday/wanderlush/tbilisi
echo Ctrl+Shift+R to reload
echo.
pause
