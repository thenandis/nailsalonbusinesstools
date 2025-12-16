#!/bin/bash

# Nail Salon Business Tools v4.0 - Server Startup Script
# Compatible with macOS and Linux

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${BLUE}"
    echo "==============================================="
    echo "   NAIL SALON BUSINESS TOOLS v4.0 - NOV 2025"
    echo "==============================================="
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Clear screen and show header
clear
print_header

print_info "Starting your business planning application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js not found on this system"
    echo ""
    echo "Node.js is required to run this application."
    echo ""
    echo "Installation options:"
    echo "1. macOS: Install via Homebrew: brew install node"
    echo "2. macOS: Download from https://nodejs.org"
    echo "3. Linux (Ubuntu/Debian): sudo apt install nodejs npm"
    echo "4. Linux (CentOS/RHEL): sudo yum install nodejs npm"
    echo ""
    read -p "Would you like to open the Node.js download page? (y/n): " choice
    
    if [[ $choice == [Yy]* ]]; then
        print_info "Opening Node.js download page..."
        if command -v open &> /dev/null; then
            # macOS
            open https://nodejs.org/en/download/
        elif command -v xdg-open &> /dev/null; then
            # Linux
            xdg-open https://nodejs.org/en/download/
        else
            echo "Please visit: https://nodejs.org/en/download/"
        fi
    fi
    
    echo ""
    print_info "After installing Node.js, restart this script:"
    echo "chmod +x START_SERVER.sh && ./START_SERVER.sh"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    print_warning "Node.js version $NODE_VERSION detected. Version 14+ recommended."
    echo "Consider updating Node.js for better performance."
    echo ""
fi

# Check if this is first run (no node_modules)
if [ ! -d "node_modules" ]; then
    print_info "First-time setup detected"
    print_info "Installing application dependencies..."
    echo "This may take a few minutes..."
    echo ""
    
    if ! npm install; then
        print_error "Failed to install dependencies"
        echo "Please check your internet connection and try again."
        echo ""
        echo "Manual installation:"
        echo "1. Ensure you have internet connection"
        echo "2. Run: npm install"
        echo "3. Then run this script again"
        exit 1
    fi
    
    echo ""
    print_success "Dependencies installed successfully!"
    echo ""
fi

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port 3000 is already in use"
    echo "Another application may be running on this port."
    echo ""
    read -p "Try to kill existing process and continue? (y/n): " kill_choice
    
    if [[ $kill_choice == [Yy]* ]]; then
        print_info "Attempting to free port 3000..."
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        sleep 2
    else
        echo "Please stop other applications using port 3000 and try again."
        exit 1
    fi
fi

# Start the application
print_info "Starting Nail Salon Business Tools..."
echo ""
print_info "The application will open automatically in your default browser."
print_info "If it doesn't open, manually navigate to: http://localhost:3000"
echo ""
echo "==============================================="
echo "   APPLICATION STATUS: STARTING..."
echo "==============================================="
echo ""
print_warning "To stop the server, press Ctrl+C in this terminal."
echo ""

# Function to open browser
open_browser() {
    sleep 3
    if command -v open &> /dev/null; then
        # macOS
        open http://localhost:3000
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open http://localhost:3000
    else
        print_info "Browser not opened automatically. Please visit: http://localhost:3000"
    fi
}

# Open browser in background
open_browser &

# Start the React development server
if npm start; then
    echo ""
    print_success "Application started successfully!"
else
    print_error "Failed to start application"
    echo "Please check the error messages above."
    exit 1
fi

# If we get here, the server stopped
echo ""
echo "==============================================="
echo "   APPLICATION STOPPED"
echo "==============================================="
echo ""
print_info "The Nail Salon Business Tools server has stopped."
print_info "Your data is automatically saved in your browser."
echo ""
print_info "To restart the application, run this script again:"
echo "./START_SERVER.sh"
echo ""
