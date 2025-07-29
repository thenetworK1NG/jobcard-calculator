@echo off
echo Starting Web Calculator Suite...
echo.
echo Choose an option:
echo 1. Open directly in default browser
echo 2. Start local server (recommended)
echo 3. Install dependencies and start with live-reload
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Opening index.html in default browser...
    start index.html
) else if "%choice%"=="2" (
    echo Starting local HTTP server on port 8000...
    echo Navigate to: http://localhost:8000
    echo Press Ctrl+C to stop the server
    python -m http.server 8000
) else if "%choice%"=="3" (
    echo Installing dependencies...
    npm install
    echo Starting development server with live-reload...
    npm run dev
) else (
    echo Invalid choice. Opening in browser...
    start index.html
)

pause
