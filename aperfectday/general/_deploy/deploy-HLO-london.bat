@echo off
REM ─── deploy-HLO-london.bat ───────────────────────────────────────────────────
REM Deploys the Hand Luggage Only London guide to the live server
REM Copies guide-specific files + shared platform files, excludes platform
REM duplicates from the guide folder.

SET ROOT=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
SET GUIDE=aperfectday\HLO\london
SET PLATFORM=%ROOT%\aperfectday\general\_platform
SET DEST=%ROOT%\aperfectday\HLO\london

REM Create destination folder if it doesn't exist
if not exist "%DEST%\images" mkdir "%DEST%\images"

echo Deploying HLO London guide...

REM Copy guide-specific files
xcopy /Y "%ROOT%\%GUIDE%\index.html" "%DEST%\"
xcopy /Y "%ROOT%\%GUIDE%\data.js"    "%DEST%\"
xcopy /Y "%ROOT%\%GUIDE%\map.js"     "%DEST%\"
xcopy /Y /E "%ROOT%\%GUIDE%\images\" "%DEST%\images\"

REM Copy platform files (shared)
xcopy /Y "%PLATFORM%\styles.css"        "%DEST%\"
xcopy /Y "%PLATFORM%\photos.js"         "%DEST%\"
xcopy /Y "%PLATFORM%\ui-card.js"        "%DEST%\"
xcopy /Y "%PLATFORM%\ui-filter.js"      "%DEST%\"
xcopy /Y "%PLATFORM%\ui-stories.js"     "%DEST%\"
xcopy /Y "%PLATFORM%\ui-favourites.js"  "%DEST%\"
xcopy /Y "%PLATFORM%\ui-pdf.js"         "%DEST%\"

echo Done! Live at: ludara.ai/aperfectday/HLO/london/
pause
