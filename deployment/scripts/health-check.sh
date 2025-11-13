#!/bin/bash

# Health Check Script for MERN Todo Application
# Usage: ./health-check.sh <backend-url>

BACKEND_URL="${1:-http://localhost:5000}"

echo "🏥 Health Check for MERN Todo Application"
echo "=========================================="
echo ""

# Check backend health
echo "Checking backend health..."
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/health")

if [ "$BACKEND_HEALTH" == "200" ]; then
    echo "✅ Backend is healthy (HTTP $BACKEND_HEALTH)"
    
    # Get detailed health info
    echo ""
    echo "Detailed health info:"
    curl -s "$BACKEND_URL/api/health/detailed" | python3 -m json.tool || echo "Could not parse detailed health"
else
    echo "❌ Backend is unhealthy (HTTP $BACKEND_HEALTH)"
    exit 1
fi

echo ""
echo "=========================================="
echo "Health check completed!"