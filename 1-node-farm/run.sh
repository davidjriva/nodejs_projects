#!/bin/bash

# Function to start server
start_server() {
  nodemon ./server/simple-http-server &
  SERVER_PID=$!
}

# Function to check if server is ready
check_server_ready() {
  while ! nc -z localhost 8000; do
    sleep 1
  done
}

# Function to open browser
open_browser() {
  # Adjust this based on your operating system
  open http://localhost:8000
}

# Function to perform cleanup
cleanup() {
  if [ -n "$SERVER_PID" ]; then
    echo "Stopping server..."
 
    kill $SERVER_PID || {
      echo "Failed to stop server using kill command."
      echo "Attempting to force kill..."
      kill -9 $SERVER_PID
    }
    echo "Server stopped."
  fi
}

start_server

check_server_ready

open_browser

read -rp "Press any key to shut down the server..."

cleanup
