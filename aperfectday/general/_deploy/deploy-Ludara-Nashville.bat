@echo off
REM ============================================================
REM  deploy-Ludara-Nashville.bat
REM  Deploys Ludara / Nashville guide (v2 MapLibre)
REM
REM  Run from:  ...\Ludara-site\aperfectday\general\_deploy\
REM  Live at:   https://ludara.ai/aperfectday/Ludara/Nashville/
REM ============================================================

set GUIDE=Ludara\Nashville

echo.
echo ==========================================================
echo  Deploying: %GUIDE%
echo ==========================================================
echo.

set REPO_ROOT=%~dp0..\..
set PLATFORM=%REPO_ROOT%\general\_platform-v2
set DEST=%REPO_ROOT%\%GUIDE%

if not exist "%PLATFORM%" (
  echo ERROR: _platform-v2 not found at %PLATFORM%
  pause & exit /b 1
)
if not exist "%DEST%" (
  echo ERROR: Guide folder not found at %DEST%
  echo        Create it and add map.js, index.html, data.js, images\ first.
  pause & exit /b 1
)

echo Copying shared platform files...
xcopy /Y /Q "%PLATFORM%\*.*" "%DEST%\"
echo Done.
echo.

cd /d "%REPO_ROOT%"
git add -A
git commit -m "Deploy Ludara/Nashville — A Perfect Day demo guide (50 places)"
git push

echo.
echo ==========================================================
echo  Done! Live in ~30s at:
echo  https://ludara.ai/aperfectday/Ludara/Nashville/
echo ==========================================================
echo.
pause
