@echo off
REM ── Deploy Hand Luggage Only London Guide ────────────────────
REM Target: ludara.ai/aperfectday/hlo/london/
REM Run from repo root after any edits

set REMOTE=root@ludara.ai
set REMOTE_PATH=/var/www/html/aperfectday/hlo/london

echo Deploying HLO London Guide to %REMOTE_PATH%...

scp config.js   %REMOTE%:%REMOTE_PATH%/config.js
scp data.js     %REMOTE%:%REMOTE_PATH%/data.js
scp map.js      %REMOTE%:%REMOTE_PATH%/map.js
scp index.html  %REMOTE%:%REMOTE_PATH%/index.html
scp styles.css  %REMOTE%:%REMOTE_PATH%/styles.css
scp photos.js   %REMOTE%:%REMOTE_PATH%/photos.js
scp ui-card.js  %REMOTE%:%REMOTE_PATH%/ui-card.js
scp ui-filter.js %REMOTE%:%REMOTE_PATH%/ui-filter.js
scp ui-stories.js %REMOTE%:%REMOTE_PATH%/ui-stories.js
scp ui-favourites.js %REMOTE%:%REMOTE_PATH%/ui-favourites.js
scp ui-pdf.js   %REMOTE%:%REMOTE_PATH%/ui-pdf.js

echo.
echo Done! Live at: https://ludara.ai/aperfectday/hlo/london/
pause
