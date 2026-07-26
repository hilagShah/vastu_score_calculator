#!/bin/bash

# Terminate background processes on exit
cleanup() {
  echo "Stopping servers..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit
}
trap cleanup INT TERM EXIT

echo "============================================="
echo " Starting Vastu Score Calculator Application"
echo "============================================="

# 1. Start Backend Server
echo "Starting Express backend on http://localhost:5001..."
cd "$(dirname "$0")/backend"
npm start &
BACKEND_PID=$!

# 2. Start Frontend Server
echo "Starting Vite React frontend on http://localhost:5173..."
cd "../frontend"
npm run dev &
FRONTEND_PID=$!

echo "---------------------------------------------"
echo "Both servers are starting up!"
echo "- Frontend: http://localhost:5173"
echo "- Backend:  http://localhost:5001"
echo "Press Ctrl+C to terminate both servers."
echo "============================================="

# Keep script running
wait $BACKEND_PID $FRONTEND_PID
