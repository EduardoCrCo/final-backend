#!/bin/bash

# Script para iniciar el proyecto completo (Frontend + Backend)

echo "🚀 Iniciando Proyecto Final - Full Stack"
echo "========================================"

# Función para matar procesos al salir
cleanup() {
    echo -e "\n🛑 Deteniendo servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap para manejar Ctrl+C
trap cleanup SIGINT SIGTERM

# Verificar si MongoDB está corriendo
echo "📋 Verificando MongoDB..."
if ! pgrep mongod > /dev/null; then
    echo "⚠️  MongoDB no está corriendo. Por favor, inicia MongoDB primero:"
    echo "   mongod --dbpath /path/to/your/db"
    echo "   O si usas MongoDB Atlas, asegúrate de tener la URI configurada en .env"
fi

# Verificar que las dependencias estén instaladas
echo "📦 Verificando dependencias..."

if [ ! -d "backend/node_modules" ]; then
    echo "🔧 Instalando dependencias del backend..."
    cd backend && npm install && cd ..
fi

if [ ! -d "node_modules" ]; then
    echo "🔧 Instalando dependencias del frontend..."
    npm install
fi

# Iniciar backend
echo "🔙 Iniciando Backend en puerto 3001..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Esperar un poco para que el backend se inicie
sleep 3

# Iniciar frontend
echo "🎨 Iniciando Frontend en puerto 5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servidores iniciados:"
echo "   📡 Backend:  http://localhost:3000"
echo "   🌐 Frontend: http://localhost:5173"
echo ""
echo "💡 Presiona Ctrl+C para detener ambos servidores"
echo ""

# Esperar a que los procesos terminen
wait