@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Ciencia Check — Setup

echo.
echo  === Ciencia Check — primeira configuracao ===
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERRO] Node.js nao encontrado. Instale Node 18+ e tente de novo.
  pause
  exit /b 1
)

if not exist "apps\api\.env" (
  echo Criando apps\api\.env a partir do exemplo...
  copy /Y "apps\api\.env.example" "apps\api\.env" >nul
  echo Ajuste usuario/senha do MySQL em apps\api\.env se precisar.
  echo.
)

echo Instalando dependencias (npm install)...
call npm install
if errorlevel 1 (
  echo [ERRO] npm install falhou.
  pause
  exit /b 1
)

echo.
echo Populando banco (npm run seed)...
call npm run seed
if errorlevel 1 (
  echo.
  echo [AVISO] Seed falhou. Confira se o MySQL esta ligado e o .env esta correto.
  echo Depois rode este SETUP de novo ou: npm run seed
  pause
  exit /b 1
)

echo.
echo  Setup OK. Agora use INICIAR.bat (duplo clique) para rodar o projeto.
echo.
pause
