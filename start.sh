#!/bin/bash

echo "🎉 Starting 90s Fun Quiz App..."

# Function to handle cleanup on script exit
cleanup() {
    echo "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set up cleanup trap
trap cleanup SIGINT SIGTERM

# Check if virtual environment exists, create if not
if [ ! -d "backend/venv" ]; then
    echo "📦 Creating virtual environment..."
    cd backend
    python -m venv venv
    cd ..
fi

# Start backend
echo "🚀 Starting Flask backend..."
cd backend
source venv/bin/activate 2>/dev/null || venv/Scripts/activate 2>/dev/null
pip install -r requirements.txt >/dev/null 2>&1
python app.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "⚛️  Starting React frontend..."
cd frontend
npm install >/dev/null 2>&1
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎯 Quiz app is starting up!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for background processes
wait 