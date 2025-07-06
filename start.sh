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

# Check and install required Python packages if not present
echo "🔍 Checking Python environment..."
if ! dpkg -l | grep -q python3-venv; then
    echo "📦 Installing required Python packages (python3-venv, python3-pip)..."
    sudo apt update -qq
    sudo apt install -y python3-venv python3-pip
    echo "✅ Python packages installed successfully"
else
    echo "✅ Python3-venv already installed"
fi

# Check if Flask is installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📦 Installing Flask and Flask-CORS..."
    pip3 install flask flask-cors
    echo "✅ Flask installed successfully"
else
    echo "✅ Flask already available"
fi

# Check if virtual environment exists, create if not
echo "🐍 Setting up Python environment..."
if [ ! -d "backend/venv" ]; then
    echo "📦 Creating virtual environment..."
    cd backend
    if python3 -m venv venv 2>/dev/null; then
        echo "✅ Virtual environment created successfully"
        # Install Flask in the virtual environment
        source venv/bin/activate
        pip install flask flask-cors
        echo "✅ Flask installed in virtual environment"
        USE_VENV=true
    else
        echo "⚠️  Failed to create virtual environment, using global Python"
        USE_VENV=false
    fi
    cd ..
else
    echo "📦 Virtual environment exists, checking activation..."
    cd backend
    if [ -f "venv/bin/activate" ]; then
        echo "✅ Virtual environment looks good, activating..."
        source venv/bin/activate
        # Ensure Flask is installed in venv
        if ! python -c "import flask" 2>/dev/null; then
            echo "📦 Installing Flask in virtual environment..."
            pip install flask flask-cors
        fi
        USE_VENV=true
    else
        echo "⚠️  Virtual environment damaged, using global Python"
        USE_VENV=false
    fi
    cd ..
fi

# Start backend
echo "🚀 Starting Flask backend..."
cd backend

# Check if we're in the right directory
echo "📁 Current directory: $(pwd)"
echo "📄 Files in backend directory:"
ls -la

# Show Python environment info
if [ "$USE_VENV" = true ]; then
    echo "🐍 Using virtual environment..."
    source venv/bin/activate 2>/dev/null || USE_VENV=false
fi

if [ "$USE_VENV" = true ]; then
    echo "✅ Virtual environment activated"
    echo "🔍 Which python: $(which python)"
    echo "🔍 Python version: $(python --version)"
    echo "🔍 Pip version: $(pip --version)"
    PYTHON_CMD="python"
else
    echo "🐍 Using global Python installation..."
    echo "🔍 Which python3: $(which python3)"
    echo "🔍 Python3 version: $(python3 --version)"
    echo "� Pip3 version: $(pip3 --version)"
    PYTHON_CMD="python3"
fi

# Test if we can import Flask
echo "🧪 Testing Flask import..."
$PYTHON_CMD -c "import flask; print('✅ Flask version:', flask.__version__)" 2>/dev/null || echo "❌ Flask import failed!"

echo "🔍 Backend logs will be shown below:"
echo "🚀 Starting Python app.py with $PYTHON_CMD..."
$PYTHON_CMD app.py 2>&1 | while IFS= read -r line; do echo "[BACKEND] $line"; done &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Check if the backend process is still running
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ Backend process is running (PID: $BACKEND_PID)"
    
    # Test if backend is responding
    echo "🧪 Testing backend connectivity..."
    if command -v curl >/dev/null 2>&1; then
        echo "Testing with curl..."
        curl -f http://localhost:3000/health 2>/dev/null && echo "✅ Backend health check passed!" || echo "❌ Backend health check failed!"
    else
        echo "Testing with wget..."
        wget -q --spider http://localhost:3000/health && echo "✅ Backend health check passed!" || echo "❌ Backend health check failed!"
    fi
else
    echo "❌ Backend process has stopped!"
fi

# Show what's listening on port 3000
echo "🔍 Checking what's listening on port 3000:"
netstat -tlnp 2>/dev/null | grep :3000 || echo "Nothing listening on port 3000"

# Start frontend
echo "⚛️  Starting React frontend..."
cd frontend
npm install >/dev/null 2>&1
npm run dev &
FRONTEND_PID=$!
cd ..

# Turn port visibility
gh codespace ports visibility 3000:public --codespace $CODESPACE_NAME
gh codespace ports visibility 3001:public --codespace $CODESPACE_NAME

echo ""
echo "🎯 Quiz app is starting up!"
echo "📱 Frontend: http://localhost:3001"
echo "🔧 Backend:  http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for background processes
wait 