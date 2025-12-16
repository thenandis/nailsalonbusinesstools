@echo off
REM =========================================
REM  CHNSC Nail Salon Business Tools
REM  Package Creator v6 FINAL - Standalone User Build
REM =========================================

REM Get the current date
echo "copying from \build to \parkthebuild for deployment"
REM Delete parkthebuild if it exists
if exist parkthebuild (
    rmdir /s /q parkthebuild
)

REM Recreate parkthebuild
mkdir parkthebuild

REM Copy latest build output to parkthebuild
xcopy build\* parkthebuild\ /E /I /Q /Y

for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (
    set "month=%%b"
    set "day=%%c"
    set "year=%%d"
)

REM Pad month and day with leading zeros if necessary
if "%month:~0,1%"==" " set "month=0%month:~1%"
if "%day:~0,1%"==" " set "day=0%day:~1%"

set "YYYYMMDD=%year%%month%%day%"
echo %YYYYMMDD%

setlocal enabledelayedexpansion

rem Get current time as HH:MM:SS.xx (24-hour format)
set "now=%time%"

rem Remove leading space if present (for single-digit hours)
if "%now:~0,1%"==" " set "now=0%now:~1%"

set "hour=!now:~0,2!"
set "minute=!now:~3,2!"
set "second=!now:~6,2!"

echo "time hhmmss - "!hour!!minute!!second!

pause
REM Pad month and day with leading zeros if necessary
REM if "%hour:~0,1%"==" " set "hour=0%hour:~1%"
REM if "%minute:~0,1%"==" " set "minute=0%minute:~1%"
REM if "%second:~0,1%"==" " set "day=0%second:~1%"

set "HHMMSS=%hour%%minute%%second%"
echo %HHMMSS%

REM Combine into YYYYMMDD format
set "formattedDateTime=%year%%month%%day%-%HHMMSS%"

set PACKAGE_NAME=nail-salon-business-tools-FINALCHECK-v%formattedDateTime%
set SOURCE_DIR=parkthebuild

echo 🏗️  Creating standalone package: %PACKAGE_NAME%
echo.

REM Clean up any existing package
if exist "%PACKAGE_NAME%" (
    echo 🧹 Cleaning up previous package...
    rmdir /s /q "%PACKAGE_NAME%"
)

REM Create package directory
mkdir "%PACKAGE_NAME%"

echo 📁 Copying application files...
xcopy "%SOURCE_DIR%\*" "%PACKAGE_NAME%\" /E /I /Q /Y

REM Remove instructions.html if present
if exist "%PACKAGE_NAME%\instructions.html" (
    echo 🗑️  Removing redundant instructions.html...
    del "%PACKAGE_NAME%\instructions.html"
)

REM Rename index.html to CHNSC_StartPage.html
echo 🔄 Renaming index.html to CHNSC_StartPage.html...
if exist "%PACKAGE_NAME%\index.html" (
    ren "%PACKAGE_NAME%\index.html" "CHNSC_StartPage.html"
)

echo ✅ Package created successfully!
echo.
echo 📋 Package Contents:
echo    📄 CHNSC_StartPage.html         (Main entry point)
echo    📁 documentation/               (Technical guides and instructions)
echo    📁 static/                      (Application assets)
echo    📄 manifest.json, favicon.ico   (App metadata)
echo    📄 service-worker.js            (Offline support)
echo    📄 All other necessary files
echo.
echo 👤 User Instructions:
echo    1. Unzip the package
echo    2. Double-click CHNSC_StartPage.html
echo    3. Start using immediately!
echo    4. Check documentation/ folder for guides
echo.
echo 🌐 Web Server Deployment:
echo    1. Upload entire folder to web server
echo    2. Access via: yourdomain.com/CHNSC_StartPage.html
echo    3. See documentation/ folder for technical details
echo.

REM Check if 7-Zip is available to create ZIP file
where 7z >nul 2>&1
if %ERRORLEVEL%==0 (
    echo 🗜️  Creating ZIP file with 7-Zip...
    7z a -tzip "%PACKAGE_NAME%.zip" "%PACKAGE_NAME%\*" -mx9
    echo ✅ ZIP file created: %PACKAGE_NAME%.zip
) else (

	REM Create the zip file using PowerShell
	powershell -command "Add-Type -Assembly System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('%PACKAGE_NAME%', '%PACKAGE_NAME%.zip')"

	echo Folder zipped successfully to %destinationZip%

    echo 📝 Note: 7-Zip not found. Please manually ZIP the folder:
    echo    Folder: %PACKAGE_NAME%
    echo    Suggested name: %PACKAGE_NAME%.zip
)

echo ✨ Ready to distribute!
echo.
pause
