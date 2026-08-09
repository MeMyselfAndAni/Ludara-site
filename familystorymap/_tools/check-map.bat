@echo off
setlocal
rem  Validate one family map folder before deploying it.
rem    check-map.bat                 -> checks every map
rem    check-map.bat BarOrFamily     -> checks just that one
cd /d "%~dp0.."
if "%~1"=="" (
  for /d %%D in (*) do (
    if exist "%%D\family.js" node "%~dp0check-map.js" "%%D"
  )
) else (
  node "%~dp0check-map.js" "%~1"
)
echo.
pause
