@echo off
cd /d "%~dp0"

echo Stopping any previous downloader server (if running)...
for /f "tokens=5" %%a in ('netstat -aon ^| find "8765" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Starting video downloader server...
py server.py
pause
