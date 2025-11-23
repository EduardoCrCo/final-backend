#!/bin/bash

# Test script para verificar que el frontend y backend funcionen correctamente

echo "🔍 Testing Backend API..."

# Test 1: Backend health check
echo "1. Testing backend health..."
HEALTH=$(curl -s http://localhost:8080/ | grep -o "API del Backend funcionando")
if [[ "$HEALTH" == "API del Backend funcionando" ]]; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not responding"
fi

# Test 2: YouTube search endpoint
echo "2. Testing YouTube search..."
SEARCH_RESULT=$(curl -s "http://localhost:8080/videos/search?q=test" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
if [[ "$SEARCH_RESULT" -gt 0 ]]; then
    echo "✅ YouTube search working - found $SEARCH_RESULT results"
else
    echo "❌ YouTube search not working"
fi

# Test 3: Response structure
echo "3. Testing response structure..."
RESPONSE_STRUCTURE=$(curl -s "http://localhost:8080/videos/search?q=drone" | grep -o '"results":\[')
if [[ "$RESPONSE_STRUCTURE" == '"results":[' ]]; then
    echo "✅ Response structure is correct"
else
    echo "❌ Response structure is incorrect"
fi

echo ""
echo "🎯 Frontend should now work correctly!"
echo "The backend returns: { message, count, results: [...] }"
echo "The frontend processes: data.results || data || []"