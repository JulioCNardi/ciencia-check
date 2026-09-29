@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Ciencia Check — Iniciar

echo.
echo  === Ciencia Check ===
echo  Abrindo API (3001) e Mobile (Expo) em janelas separadas.
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERRO] Node.js nao encontrado.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Dependencias nao encontradas. Rodando SETUP.bat...
  call "%~dp0SETUP.bat"
  if errorlevel 1 exit /b 1
)

if not exist "apps\api\.env" (
  copy /Y "apps\api\.env.example" "apps\api\.env" >nul
  echo Criado apps\api\.env — ajuste a senha do MySQL se necessario.
)

echo Iniciando API...
start "Ciencia Check — API" cmd /k "cd /d ""%~dp0"" && npm run api"

timeout /t 3 /nobreak >nul

echo Iniciando Mobile...
start "Ciencia Check — Mobile" cmd /k "cd /d ""%~dp0"" && npm run mobile"

echo.
echo  Pronto.
echo  - API:    http://localhost:3001
echo  - Mobile: leia o QR Code na janela do Expo (Expo Go) ou pressione w para web
echo  - Turma:  DEMO2026
echo.
echo  Feche as duas janelas para parar.
echo.
pause
