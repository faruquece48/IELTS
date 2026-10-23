@echo off
setlocal

set "RECORDER_DATA=%LOCALAPPDATA%\MapsTripRecorderChrome"
set "CHROME_EXE=%ProgramFiles%\Google\Chrome\Application\chrome.exe"

if not exist "%CHROME_EXE%" set "CHROME_EXE=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME_EXE%" set "CHROME_EXE=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"

if not exist "%CHROME_EXE%" (
  echo Google Chrome was not found on this computer.
  echo Install Chrome and run this file again.
  pause
  exit /b 1
)

if not exist "%RECORDER_DATA%" mkdir "%RECORDER_DATA%"

start "Maps Trip Time Recorder" "%CHROME_EXE%" --user-data-dir="%RECORDER_DATA%" --profile-directory="Recorder" --no-first-run --disable-default-apps "http://localhost:3000/personal/traffic"

endlocal
