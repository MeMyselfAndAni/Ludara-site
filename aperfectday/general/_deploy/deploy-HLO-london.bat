@echo off
REM ─── deploy-HLO-london.bat ───────────────────────────────────────────────────
REM Deploys the Hand Luggage Only London guide to the live server
REM Copies guide-specific files + shared platform files, excludes platform
REM duplicates from the guide folder.

SET GUIDE=aperfectday\HLO\london
SET PLATFORM=aperfectday\general\_platform
SET DEST=\\server\ludara-site\

echo Deploying HLO London guide...

REM Copy guide-specific files
xcopy /Y "%GUIDE%\index.html" "%DEST%%GUIDE%\"
xcopy /Y "%GUIDE%\data.js"    "%DEST%%GUIDE%\"
xcopy /Y "%GUIDE%\map.js"     "%DEST%%GUIDE%\"
xcopy /Y /E "%GUIDE%\images\" "%DEST%%GUIDE%\images\"

REM Copy platform files (shared)
xcopy /Y "%PLATFORM%\styles.css"        "%DEST%%GUIDE%\"
xcopy /Y "%PLATFORM%\photos.js"         "%DEST%%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-card.js"        "%DEST%%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-filter.js"      "%DEST%%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-stories.js"     "%DEST%%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-favourites.js"  "%DEST%%GUIDE%\"
xcopy /Y "%PLATFORM%\ui-pdf.js"         "%DEST%%GUIDE%\"

echo Done! Live at: ludara.ai/aperfectday/HLO/london/
pause
