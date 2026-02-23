@echo off
echo ============================================
echo Starting Liquor Mart Application
echo ============================================

echo.
echo Starting Backend (Port 5000)...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend (Port 5173)...
cd /d "%~dp0frontend"
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ============================================
echo Both servers are starting...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window.
echo (The servers will keep running in background)
echo ============================================

pause >nul
