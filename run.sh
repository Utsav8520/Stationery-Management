#!/bin/bash

set -e

# Function to start the backend
start_backend() {
  echo "Starting backend..."
  cd backend
  npm run dev &
  BACKEND_PID=$!
  cd ..
}

# Function to start the frontend
start_frontend() {
  echo "Starting frontend..."
  cd frontend
  npm run dev &
  FRONTEND_PID=$!
  cd ..
}

# Function to clean and set up
clean_setup() {
  echo "--- Cleaning and Setting Up ---"

  echo "Installing backend dependencies..."
  cd backend
  npm install

  echo "Running Prisma migrations..."
  npx prisma migrate dev --name init --skip-generate --preview-feature
  npx prisma generate
  
  echo "Seeding database..."
  # Check if prisma.seed is defined in package.json, otherwise run directly
  if grep -q '"seed":' package.json; then
    npx prisma db seed
  else
    echo "Prisma seed script not found in package.json, running node prisma/seed.js directly..."
    node prisma/seed.js
  fi
  cd ..

  echo "Installing frontend dependencies..."
  cd frontend
  npm install
  cd ..

  echo "--- Setup Complete ---"
}

# Trap to kill background processes on script exit
trap 'kill $BACKEND_PID $FRONTEND_PID' SIGINT SIGTERM EXIT

# Check for 'clean' argument
if [ "$1" == "clean" ]; then
  clean_setup
fi

# Run concurrently
start_backend
start_frontend

echo "Frontend and Backend are running. Press Ctrl+C to stop."
wait
