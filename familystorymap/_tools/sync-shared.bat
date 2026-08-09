@echo off
setlocal
rem  Push the shared engine files from one map into all the others.
rem    sync-shared.bat                       -> dry run from LandoKliotFamily
rem    sync-shared.bat LandoKliotFamily --write
cd /d "%~dp0.."
set "REF=%~1"
if "%REF%"=="" set "REF=LandoKliotFamily"
node "%~dp0sync-shared.js" "%REF%" %2
echo.
pause
