#!/bin/bash

# 1. Build Frontend
echo "🏗️  Building Frontend..."
cd frontend
npm install
ng build

# 2. Clean Backend Static folder
echo "🧹 Cleaning Backend Static Resources..."
cd ../backend/src/main/resources
rm -rf static
mkdir static

# 3. Copy Build Artifacts
echo "tc  Copying Frontend to Backend..."
# Angular 17+ defaults to dist/frontend/browser or similar. 
# We copy the contents of the 'browser' folder or the 'frontend' folder depending on config.
# Assuming standard angular Dist structure:
cp -r ../../../../frontend/dist/frontend/browser/* static/ 2>/dev/null || cp -r ../../../../frontend/dist/frontend/* static/

echo "✅ Frontend updated in Backend Resources!"
echo "👉 Now run: git add . && git commit -m 'update frontend' && git push"
