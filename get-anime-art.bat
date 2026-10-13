@echo off
cd /d "%~dp0"
echo Downloading anime pictures into public\art\characters ... (no Node.js needed)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\fetch-art.ps1"
echo.
echo Done. Upload the WHOLE project (including public\art\characters) when you deploy.
pause
