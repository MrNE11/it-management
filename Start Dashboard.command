#!/bin/bash
# Double-click this file to start the IT Support Dashboard.
# It runs PHP's built-in web server (required to process index.php and
# the views/*.php includes) and opens the dashboard in your default browser.

cd "$(dirname "$0")"

PORT=3412
URL="http://localhost:$PORT/index.php"

if ! command -v php >/dev/null 2>&1; then
  echo "PHP is not installed or not on PATH. Install it (e.g. 'brew install php') and try again."
  read -p "Press Enter to close..."
  exit 1
fi

if lsof -i ":$PORT" -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "IT Support Dashboard server is already running on port $PORT."
  open "$URL"
  exit 0
fi

echo "Starting IT Support Dashboard server (PHP) on port $PORT..."
php -S "127.0.0.1:$PORT" &
SERVER_PID=$!

sleep 1
open "$URL"

echo ""
echo "IT Support Dashboard is running at $URL"
echo "Keep this window open while you use the dashboard."
echo "Close this window (or press Ctrl+C) to stop the server."
echo ""

trap "kill $SERVER_PID 2>/dev/null" EXIT
wait $SERVER_PID
