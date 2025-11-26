@echo off
title Flood Rescue Scout API Server
color 0A
echo.
echo ========================================
echo   Flood Rescue Scout API Server
echo ========================================
echo.
echo Starting server on http://localhost:3000
echo API Endpoint: http://localhost:3000/api/flood-rescue
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

cd /d "%~dp0"
node api-example.js

pause

