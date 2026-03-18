@echo off
SET ROOT=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
cd /d "%ROOT%"
git add aperfectday\wanderlush\tbilisi-offline\
git commit -m "Update tbilisi-offline %DATE% %TIME%"
git push
echo.
echo Done!
pause
