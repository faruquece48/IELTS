@echo off
rem Invoked by Windows via the registered "ieltsdownloader://" protocol handler.
rem %1 is the full "ieltsdownloader://start" URL passed by the OS - it's ignored here.
cd /d "%~dp0"

taskkill /F /T /FI "WINDOWTITLE eq IELTS Downloader*" >nul 2>&1
start /min "IELTS Downloader" cmd /c start.bat
