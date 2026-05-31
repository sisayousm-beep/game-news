@echo off
chcp 65001 >nul
title LOGIA 실행기
cd /d "%~dp0"
set PYTHONUTF8=1

echo.
echo   ============================================
echo      LOGIA - 게임 데일리 브리핑
echo   ============================================
echo.
echo   서버를 켜는 중입니다.
echo   새로 열리는 검은 창 2개는 끄지 마세요.
echo   잠시 후 브라우저가 자동으로 열립니다...
echo.

REM --- 백엔드(API) 시작 ---
start "LOGIA Backend" cmd /k "cd backend & .venv\Scripts\python.exe -m uvicorn app.main:app --port 8000"

REM --- 프론트엔드(웹) 시작 ---
start "LOGIA Frontend" cmd /k "cd frontend & npm run dev"

REM --- 서버가 뜰 시간을 잠깐 준 뒤 브라우저 열기 ---
timeout /t 11 /nobreak >nul
start "" http://localhost:3000

echo.
echo   브라우저에서 http://localhost:3000 이 열렸습니다.
echo   (안 열렸으면 잠시 뒤 새로고침 하세요.)
echo.
echo   * 끄는 방법: 새로 열린 검은 창 2개를 닫으면 됩니다.
echo   * 이 창은 지금 닫아도 됩니다.
echo.
pause
