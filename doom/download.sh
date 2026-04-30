#!/bin/bash
# Downloads the pre-built Chocolate Doom WASM assets from chlewtf/doom-wasm.
# Run once from the project root: bash doom/download.sh
set -e

BASE="https://raw.githubusercontent.com/chlewtf/doom-wasm/main"
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Downloading Doom WASM assets (~30 MB total)..."
curl -L --progress-bar "$BASE/chocolate-doom.js"   -o "$DIR/chocolate-doom.js"
curl -L --progress-bar "$BASE/chocolate-doom.wasm" -o "$DIR/chocolate-doom.wasm"
curl -L --progress-bar "$BASE/chocolate-doom.data" -o "$DIR/chocolate-doom.data"
echo "Done. Serve the portfolio with any static web server to play."
