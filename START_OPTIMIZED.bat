@echo off
echo Starting Nail Salon Budget Tool with Memory Optimization...
echo.
echo Memory Settings:
echo - Node.js max memory: 4GB
echo - Source maps: Disabled
echo - Fast refresh: Enabled
echo.

REM Set environment variables
set NODE_OPTIONS=--max-old-space-size=4096
set GENERATE_SOURCEMAP=false
set FAST_REFRESH=true

echo Starting React development server...
npm start

pause
