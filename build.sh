#!/bin/bash
set -e

echo "Building UI..."
cd ui
npm install
npm run build
cd ..
echo "UI built successfully."
