@echo off
REM Script para iniciar el proyecto completo (Frontend + Backend) en Windows

echo 🚀 Iniciando Proyecto Final - Full Stack
echo ========================================

REM Verificar dependencias del backend
if not exist "backend\node_modules" (
    echo 🔧 Instalando dependencias del backend...
    cd backend
    npm install
    cd ..
)

REM Verificar dependencias del frontend
if not exist "node_modules" (
    echo 🔧 Instalando dependencias del frontend...
    npm install
)

echo 📋 Verificando MongoDB...
echo ⚠️  Asegúrate de que MongoDB esté corriendo:
echo    - MongoDB local: mongod
echo    - MongoDB Atlas: configura MONGODB_URI en backend\.env
echo.

REM Iniciar backend en una nueva ventana
echo 🔙 Iniciando Backend en puerto 3000...
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Esperar un poco
timeout /t 3 /nobreak >nul

REM Iniciar frontend en una nueva ventana
echo 🎨 Iniciando Frontend en puerto 5173...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Servidores iniciados en ventanas separadas:
echo    📡 Backend:  http://localhost:3000
echo    🌐 Frontend: http://localhost:5173
echo.
echo 💡 Cierra las ventanas de terminal para detener los servidores
echo.
pause