@echo off
title Nail Salon Business Tools v4.0 - Server Startup
color 0A

echo.
echo ===============================================
echo   NAIL SALON BUSINESS TOOLS v4.0 - NOV 2025
echo ===============================================
echo.
echo Starting your business planning application...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Node.js not found on this system
    echo.
    echo Node.js is required to run this application.
    echo Would you like to download and install Node.js automatically?
    echo.
    echo 1. Yes - Download and install Node.js ^(Recommended^)
    echo 2. No - I'll install it manually
    echo.
    set /p choice="Enter your choice (1 or 2): "
    
    if "%choice%"=="1" (
        echo.
        echo Opening Node.js download page...
        start https://nodejs.org/en/download/
        echo.
        echo Please:
        echo 1. Download and install Node.js from the opened webpage
        echo 2. Restart this script after installation
        echo 3. Choose the LTS version for best stability
        pause
        exit /b 1
    ) else (
        echo.
        echo Please download Node.js from: https://nodejs.org
        echo After installation, restart this script.
        pause
        exit /b 1
    )
)

REM Check if this is first run (no node_modules)
if not exist "node_modules" (
    echo [SETUP] First-time setup detected
    echo Installing application dependencies...
    echo This may take a few minutes...
    echo.
    
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [ERROR] Failed to install dependencies
        echo Please check your internet connection and try again.
        pause
        exit /b 1
    )
    
    echo.
    echo [SUCCESS] Dependencies installed successfully!
    echo.
)

REM Start the application
echo Starting Nail Salon Business Tools...
echo.
echo The application will open automatically in your default browser.
echo If it doesn't open, manually navigate to: http://localhost:3000
echo.
echo ===============================================
echo   APPLICATION STATUS: STARTING...
echo ===============================================
echo.
echo To stop the server, press Ctrl+C or close this window.
echo.

REM Wait a moment then open browser
timeout /t 3 /nobreak >nul
start http://localhost:3000

REM Start the React development server
call npm start

REM If we get here, the server stopped
echo.
echo ===============================================
echo   APPLICATION STOPPED
echo ===============================================
echo.
echo The Nail Salon Business Tools server has stopped.
echo Your data is automatically saved in your browser.
echo.
echo To restart the application, run this script again.
echo.
pause
