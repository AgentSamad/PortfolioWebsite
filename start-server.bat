@echo off
echo Starting Next.js development server...
echo.
cd /d %~dp0

if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo npm install failed.
        pause
        exit /b 1
    )
    echo.
)

echo Open your browser and go to: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
call npm run dev
