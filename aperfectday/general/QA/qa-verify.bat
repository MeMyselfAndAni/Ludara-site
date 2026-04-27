@echo off
setlocal enabledelayedexpansion
REM A Perfect Day Platform QA Script (Deploy + Verify)
REM Usage: qa-verify.bat "C:\Full\Path\To\Platform\Directory"

REM Enable ANSI escape sequences for color support (Windows 10+)
REM Simplified color setup - just use ANSI codes directly
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "RESET=[0m"

if "%~1"=="" (
    echo ERROR: Please provide platform directory path
    echo Usage: qa-verify.bat "C:\Full\Path\To\Platform\Directory"
    pause
    exit /b 1
)

set "PLATFORM_PATH=%~1"
set "GENERAL_PLATFORM=C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\general\_platform-v2"
set ERROR_COUNT=0

echo ======================================================================
echo A PERFECT DAY PLATFORM QA SCRIPT (DEPLOY + VERIFY)
echo ======================================================================
echo Platform Path: %PLATFORM_PATH%
echo General Platform: %GENERAL_PLATFORM%

if not exist "%GENERAL_PLATFORM%" (
    echo %RED%❌ General platform directory not found%RESET%
    pause
    exit /b 1
) else (
    echo ✅ General platform directory found
)

if not exist "%PLATFORM_PATH%" (
    echo %RED%❌ Platform directory not found%RESET%
    pause
    exit /b 1
) else (
    echo ✅ Platform directory found
)

echo ======================================================================
echo STEP 1: DEPLOYING LATEST FILES FROM GENERAL PLATFORM
echo ======================================================================

echo Copying all files from general platform...
xcopy "%GENERAL_PLATFORM%\*" "%PLATFORM_PATH%\" /Y /S /Q
if %errorlevel% equ 0 (
    echo ✅ All files copied successfully
) else (
    echo %RED%❌ Error copying files%RESET%
    set /a ERROR_COUNT+=1
)

echo.
echo ======================================================================
echo STEP 2: NEIGHBORHOOD FUNCTIONALITY VERIFICATION
echo ======================================================================

echo Checking neighborhood data integrity...

if exist "%PLATFORM_PATH%\data.js" (
    for /f %%A in ('findstr /C:"nbhd:" "%PLATFORM_PATH%\data.js" ^| find /c ":"') do set NBHD_COUNT=%%A
    if !NBHD_COUNT! gtr 10 (
        echo ✅ Found !NBHD_COUNT! places with neighborhood assignments
    ) else (
        echo %RED%❌ ERROR: Only !NBHD_COUNT! neighborhood assignments found - need more%RESET%
        set /a ERROR_COUNT+=1
    )
    
    findstr "nbhd: 'city'" "%PLATFORM_PATH%\data.js" >nul
    if !errorlevel! equ 0 (
        echo ✅ City neighborhood found in data
    ) else (
        echo %RED%❌ ERROR: No city neighborhood found - data may be incomplete%RESET%
        set /a ERROR_COUNT+=1
    )
    
    findstr /C:"nbhd: 'peninsula'" "%PLATFORM_PATH%\data.js" >nul
    if !errorlevel! equ 0 (
        echo ✅ Peninsula neighborhood found in data
    ) else (
        echo ⚠️  Peninsula neighborhood missing from data
    )
) else (
    echo %RED%❌ ERROR: data.js not found%RESET%
    set /a ERROR_COUNT+=1
)

echo.
echo Checking neighborhood configuration...

if exist "%PLATFORM_PATH%\map.js" (
    findstr "NBHD_COLORS" "%PLATFORM_PATH%\map.js" >nul
    if !errorlevel! equ 0 (
        echo ✅ NBHD_COLORS configuration found
    ) else (
        echo %RED%❌ ERROR: NBHD_COLORS missing from map.js%RESET%
        set /a ERROR_COUNT+=1
    )
    
    findstr "NBHD_LABELS" "%PLATFORM_PATH%\map.js" >nul
    if !errorlevel! equ 0 (
        echo ✅ NBHD_LABELS configuration found
    ) else (
        echo %RED%❌ ERROR: NBHD_LABELS missing from map.js%RESET%
        set /a ERROR_COUNT+=1
    )
) else (
    echo %RED%❌ ERROR: map.js not found%RESET%
    set /a ERROR_COUNT+=1
)

echo.
echo Checking neighborhood UI functionality...

if exist "%PLATFORM_PATH%\ui-stories.js" (
    echo ✅ ui-stories.js exists
    
    findstr "function selectNbhd" "%PLATFORM_PATH%\ui-stories.js" >nul
    if !errorlevel! equ 0 (
        echo ✅ selectNbhd function exists
    ) else (
        echo %RED%❌ ERROR: selectNbhd function missing%RESET%
        set /a ERROR_COUNT+=1
    )
    
    findstr "function alignNbhdBar" "%PLATFORM_PATH%\ui-stories.js" >nul
    if !errorlevel! equ 0 (
        echo ✅ alignNbhdBar function exists
    ) else (
        echo %RED%❌ ERROR: alignNbhdBar function missing%RESET%
        set /a ERROR_COUNT+=1
    )
) else (
    echo %RED%❌ ERROR: ui-stories.js missing%RESET%
    set /a ERROR_COUNT+=1
)

if exist "%PLATFORM_PATH%\ui-filter.js" (
    echo ✅ ui-filter.js exists
    
    findstr "function applyFilters" "%PLATFORM_PATH%\ui-filter.js" >nul
    if !errorlevel! equ 0 (
        echo ✅ applyFilters function exists
    ) else (
        echo %RED%❌ ERROR: applyFilters function missing%RESET%
        set /a ERROR_COUNT+=1
    )
) else (
    echo %RED%❌ ERROR: ui-filter.js missing%RESET%
    set /a ERROR_COUNT+=1
)

echo.
echo Checking neighborhood HTML structure...

if exist "%PLATFORM_PATH%\index.html" (
    findstr "nbhd-bar" "%PLATFORM_PATH%\index.html" >nul
    if !errorlevel! equ 0 (
        echo ✅ Neighborhood bar HTML structure exists
        
        findstr "nbhd-downtown\|nbhd-germantown" "%PLATFORM_PATH%\index.html" >nul
        if !errorlevel! equ 0 (
            echo %RED%❌ ERROR: Nashville neighborhoods found - wrong city%RESET%
            set /a ERROR_COUNT+=1
        ) else (
            echo ✅ No Nashville neighborhoods found ^(good for non-Nashville cities^)
        )
        
        findstr "Cape Town" "%PLATFORM_PATH%\index.html" >nul
        if !errorlevel! equ 0 (
            REM Check for Cape Town neighborhoods individually
            set CT_FOUND=0
            findstr "nbhd-city" "%PLATFORM_PATH%\index.html" >nul
            if !errorlevel! equ 0 set CT_FOUND=1
            findstr "nbhd-peninsula" "%PLATFORM_PATH%\index.html" >nul  
            if !errorlevel! equ 0 set CT_FOUND=1
            findstr "nbhd-stellenbosch" "%PLATFORM_PATH%\index.html" >nul
            if !errorlevel! equ 0 set CT_FOUND=1
            
            if !CT_FOUND! equ 1 (
                echo ✅ Cape Town neighborhoods found in HTML
            ) else (
                echo %RED%❌ ERROR: Cape Town city but missing Cape Town neighborhoods in HTML%RESET%
                set /a ERROR_COUNT+=1
            )
        )
        
    ) else (
        echo %RED%❌ ERROR: No nbhd-bar element in index.html%RESET%
        set /a ERROR_COUNT+=1
    )
) else (
    echo ⚠️  index.html not found for neighborhood HTML check
)

echo.
echo ======================================================================
echo STEP 3: HARDCODED CITY NAME DETECTION
echo ======================================================================

echo Checking for hardcoded city names in general platform files...

set UNIVERSAL_FILES=ui-favourites.js ui-filter.js ui-pdf.js ui-card.js ui-stories.js map-core.js

for %%f in (%UNIVERSAL_FILES%) do (
    if exist "%PLATFORM_PATH%\%%f" (
        echo Checking %%f for hardcoded city names...
        
        REM Look for problematic string assignments
        findstr "=\".*Nashville" "%PLATFORM_PATH%\%%f" >nul 2>&1
        if !errorlevel! equ 0 (
            echo ❌ HARDCODED NASHVILLE in string assignment found in %%f
            set /a ERROR_COUNT+=1
        )
        
        findstr "=\".*Cape Town" "%PLATFORM_PATH%\%%f" >nul 2>&1
        if !errorlevel! equ 0 (
            echo ❌ HARDCODED CAPE TOWN in string assignment found in %%f
            set /a ERROR_COUNT+=1
        )
        
        findstr "`.*Nashville.*`" "%PLATFORM_PATH%\%%f" >nul 2>&1
        if !errorlevel! equ 0 (
            echo ❌ HARDCODED NASHVILLE in template literal found in %%f
            set /a ERROR_COUNT+=1
        )
        
        findstr "`.*Cape Town.*`" "%PLATFORM_PATH%\%%f" >nul 2>&1
        if !errorlevel! equ 0 (
            echo ❌ HARDCODED CAPE TOWN in template literal found in %%f
            set /a ERROR_COUNT+=1
        )
        
        findstr "GUIDE_CITY" "%PLATFORM_PATH%\%%f" >nul 2>&1
        if !errorlevel! equ 0 (
            echo ✅ %%f uses GUIDE_CITY variable ^(universal approach^)
        )
        
    ) else (
        echo ⚠️  %%f not found
    )
)

echo.
echo ======================================================================
echo STEP 4: REQUIRED FILES CHECK
echo ======================================================================

echo Checking for required files...

set REQUIRED_FILES=universal-distance-functionality.js ui-favourites.js ui-filter.js map-core.js ui-pdf.js

for %%f in (%REQUIRED_FILES%) do (
    if exist "%PLATFORM_PATH%\%%f" (
        echo ✅ %%f exists
    ) else (
        echo %RED%❌ ERROR: %%f missing
        set /a ERROR_COUNT+=1
    )
)

if exist "%PLATFORM_PATH%\index.html" (
    echo ✅ index.html exists
) else (
    echo ⚠️  WARNING: index.html not found
)

echo.
echo ======================================================================
echo QA SUMMARY
echo ======================================================================

if %ERROR_COUNT% equ 0 (
    echo %GREEN%✅ ALL CHECKS PASSED! Platform is ready for deployment.%RESET%
    echo.
    echo %GREEN%🎉 DEPLOYMENT STATUS: READY%RESET%
    echo.
    echo Next steps:
    echo    1. Test in browser to confirm neighborhoods work
    echo    2. Verify attribution shows correctly
    echo    3. If satisfied, deploy to production
    echo.
) else (
    echo %RED%❌ %ERROR_COUNT% ERROR^(S^) FOUND! Platform needs fixes.%RESET%
    echo.
    echo %RED%🚨 DEPLOYMENT STATUS: NOT READY%RESET%
    echo.
    echo %YELLOW%ERRORS THAT MUST BE FIXED:%RESET%
    
    REM Re-run quick checks to list specific errors found
    if not exist "%PLATFORM_PATH%\data.js" (
        echo    %RED%• Missing data.js file%RESET%
    )
    if not exist "%PLATFORM_PATH%\map.js" (
        echo    %RED%• Missing map.js file%RESET%
    )
    if not exist "%PLATFORM_PATH%\ui-stories.js" (
        echo    %RED%• Missing ui-stories.js file%RESET%
    )
    if not exist "%PLATFORM_PATH%\ui-filter.js" (
        echo    %RED%• Missing ui-filter.js file%RESET%
    )
    
    REM Check for specific function issues
    if exist "%PLATFORM_PATH%\ui-stories.js" (
        findstr "function selectNbhd" "%PLATFORM_PATH%\ui-stories.js" >nul
        if !errorlevel! neq 0 (
            echo    %RED%• selectNbhd function missing in ui-stories.js%RESET%
        )
        findstr "function alignNbhdBar" "%PLATFORM_PATH%\ui-stories.js" >nul
        if !errorlevel! neq 0 (
            echo    %RED%• alignNbhdBar function missing in ui-stories.js%RESET%
        )
    )
    
    if exist "%PLATFORM_PATH%\ui-filter.js" (
        findstr "function applyFilters" "%PLATFORM_PATH%\ui-filter.js" >nul
        if !errorlevel! neq 0 (
            echo    %RED%• applyFilters function missing in ui-filter.js%RESET%
        )
    )
    
    REM Check for neighborhood configuration issues
    if exist "%PLATFORM_PATH%\map.js" (
        findstr "NBHD_COLORS" "%PLATFORM_PATH%\map.js" >nul
        if !errorlevel! neq 0 (
            echo    %RED%• NBHD_COLORS configuration missing in map.js%RESET%
        )
        findstr "NBHD_LABELS" "%PLATFORM_PATH%\map.js" >nul
        if !errorlevel! neq 0 (
            echo    %RED%• NBHD_LABELS configuration missing in map.js%RESET%
        )
    )
    
    REM Check for neighborhood HTML issues
    if exist "%PLATFORM_PATH%\index.html" (
        findstr "nbhd-bar" "%PLATFORM_PATH%\index.html" >nul
        if !errorlevel! neq 0 (
            echo    %RED%• Neighborhood bar HTML structure missing%RESET%
        ) else (
            findstr "nbhd-downtown\|nbhd-germantown" "%PLATFORM_PATH%\index.html" >nul
            if !errorlevel! equ 0 (
                echo    %RED%• Nashville neighborhoods found in HTML - wrong city%RESET%
            )
        )
    )
    
    REM Check for hardcoded city names
    for %%f in (ui-favourites.js ui-filter.js ui-pdf.js ui-card.js ui-stories.js) do (
        if exist "%PLATFORM_PATH%\%%f" (
            findstr /r "=\".*Nashville" "%PLATFORM_PATH%\%%f" >nul
            if !errorlevel! equ 0 (
                echo    %RED%• Hardcoded Nashville found in %%f%RESET%
            )
            findstr /r "=\".*Cape Town" "%PLATFORM_PATH%\%%f" >nul
            if !errorlevel! equ 0 (
                echo    %RED%• Hardcoded Cape Town found in %%f%RESET%
            )
        )
    )
    
    echo.
    echo %YELLOW%⚠️  DO NOT DEPLOY until all errors above are fixed.%RESET%
    echo.
)

echo Platform verified: %PLATFORM_PATH%
echo Timestamp: %date% %time%
echo.
pause
