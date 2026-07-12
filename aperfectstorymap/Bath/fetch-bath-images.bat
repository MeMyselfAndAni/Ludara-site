@echo off
setlocal enabledelayedexpansion
echo ================================
echo   FETCH BATH IMAGES (Wikimedia Commons, CC-licensed)
echo   Saves 10 photos into .\images\ as place-1.jpg ... place-10.jpg
echo   (retries + pauses to avoid Wikimedia rate-limiting)
echo ================================
echo.

set "DIR=%~dp0images\"
set "UA=Mozilla/5.0 (Ludara.AI A Perfect Story Map image fetch)"
set "BASE=https://commons.wikimedia.org/wiki/Special:FilePath/"
if not exist "%DIR%" mkdir "%DIR%"

rem  Special:FilePath resolves any file by name. We retry on transient
rem  errors (429/5xx) and pause ~2s between files so the thumbnail server
rem  does not throttle us. Falls back to full resolution if the thumb fails.

call :grab 1  "Holburne Museum"      "Holburne_Museum.jpg"
call :grab 2  "Royal Crescent"       "2023-09-15_Bath_Royal_Crescent_05.jpg"
call :grab 3  "No.1 Royal Crescent"  "2023-09-15_Bath_Royal_Crescent_01.jpg"
call :grab 4  "Abbey Green"          "London_plane_at_Abbey_Green,_Bath_2025-07-23.jpg"
call :grab 5  "Bath Street"          "Bath_Street_colonnade.jpg"
call :grab 6  "Beauford Square"      "Bath._Beauford_square.jpg"
call :grab 7  "Trim Street"          "Trim_Street,_Bath.JPG"
call :grab 8  "Assembly Rooms"       "Bath_,_Assembly_Rooms_-_geograph.org.uk_-_6566729.jpg"
call :grab 9  "Guildhall"            "Bath_Guildhall,_April_2020.jpg"
call :grab 10 "Edward Street"        "Edward_Street,_Bath_-_geograph.org.uk_-_8220145.jpg"

rem  ── Bristol (Rivals) ──
call :grab 11 "Corn Street"          "Corn_Street,_Bristol_-_geograph.org.uk_-_2476973.jpg"
call :grab 12 "Harbour Hotel"        "Harbour_Hotel,_53_and_55_Corn_Street_-_DSC_2220.jpg"
call :grab 13 "Cosy Club"            "31_Corn_Street,_Bristol_-_geograph.org.uk_-_5447318.jpg"
call :grab 14 "St Nicholas Market"   "Bristol_-_St_Nicholas_Market_-_geograph.org.uk_-_5265951.jpg"
call :grab 15 "Aerospace Concorde"   "Ex-British_Airways_Concorde_216_(G-BOAF)_on_display_at_Aerospace_Bristol_8August2019_arp.jpg"
call :grab 16 "Queen Square"         "King_William_III_statue_Queen_Square,_Bristol.jpg"

echo.
echo ================================
echo   Done. Check .\images\ for place-1.jpg ... place-16.jpg
echo   Credits are already set in credits.js (keep them in sync).
echo ================================
pause
exit /b 0

:grab
rem  %1 = id, %2 = friendly name, %3 = Commons filename
echo Downloading place-%~1  (%~2) ...
curl -L --fail -s --retry 6 --retry-delay 3 -A "%UA%" -o "%DIR%place-%~1.jpg" "%BASE%%~3?width=1280"
if errorlevel 1 (
  echo   thumb throttled, waiting then trying full resolution...
  ping -n 3 127.0.0.1 >nul
  curl -L --fail -s --retry 6 --retry-delay 3 -A "%UA%" -o "%DIR%place-%~1.jpg" "%BASE%%~3"
)
if errorlevel 1 ( echo   [FAILED] place-%~1 - tell Claude ) else ( echo   ok place-%~1.jpg )
rem  polite pause between files to avoid rate-limiting
ping -n 3 127.0.0.1 >nul
exit /b 0
