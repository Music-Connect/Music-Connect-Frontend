#!/bin/bash
# Test Suite for Music Connect - Complete System
# Tests: Backend Core, BFF Mobile, BFF Web

echo "🧪 Music Connect - Test Suite"
echo "================================"
echo ""

BASE_BACKEND="http://localhost:3001"
BASE_BFF_MOBILE="http://localhost:3002"
BASE_BFF_WEB="http://localhost:3003"

TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="${4:-}"
    local expected_status="${5:-200}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$url" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" 2>/dev/null)
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "$expected_status" ]; then
        echo "✅ PASS: $name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo "$body"
    else
        echo "❌ FAIL: $name (Status: $status_code, Expected: $expected_status)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Health Checks
echo -e "\n🏥 Health Checks"
echo "-------------------"
test_endpoint "Backend Core Health" "$BASE_BACKEND/health"
test_endpoint "BFF Mobile Health" "$BASE_BFF_MOBILE/health"
test_endpoint "BFF Web Health" "$BASE_BFF_WEB/health"

# Backend Core Tests
echo -e "\n🔧 Backend Core Tests"
echo "----------------------"

RANDOM_NUM=$RANDOM
EMAIL="teste${RANDOM_NUM}@example.com"
REGISTER_DATA="{\"usuario\":\"TesteUser$RANDOM_NUM\",\"email\":\"$EMAIL\",\"senha\":\"senha123\",\"tipo_usuario\":\"contratante\",\"telefone\":\"11999999999\",\"cidade\":\"São Paulo\",\"estado\":\"SP\"}"

echo "Registering user..."
test_endpoint "Register User (Backend)" "$BASE_BACKEND/api/usuarios/auth/register" "POST" "$REGISTER_DATA" "201"

LOGIN_DATA="{\"email\":\"$EMAIL\",\"senha\":\"senha123\"}"
test_endpoint "Login User (Backend)" "$BASE_BACKEND/api/usuarios/auth/login" "POST" "$LOGIN_DATA"

test_endpoint "Get All Users (Backend)" "$BASE_BACKEND/api/usuarios"
test_endpoint "Get All Artists (Backend)" "$BASE_BACKEND/api/artistas"
test_endpoint "Filter Artists by Genre (Backend)" "$BASE_BACKEND/api/artistas?genero=Rock"

# BFF Mobile Tests
echo -e "\n📱 BFF Mobile Tests"
echo "--------------------"
test_endpoint "Login (Mobile BFF)" "$BASE_BFF_MOBILE/api/mobile/auth/login" "POST" "$LOGIN_DATA"
test_endpoint "Get Artists with Limit (Mobile BFF)" "$BASE_BFF_MOBILE/api/mobile/artistas?limit=10"

# BFF Web Tests
echo -e "\n🌐 BFF Web Tests"
echo "-----------------"
test_endpoint "Login (Web BFF)" "$BASE_BFF_WEB/api/web/auth/login" "POST" "$LOGIN_DATA"
test_endpoint "Get Explore Data (Web BFF)" "$BASE_BFF_WEB/api/web/explore"
test_endpoint "Get All Artists (Web BFF)" "$BASE_BFF_WEB/api/web/artistas"

# Test Summary
echo -e "\n================================"
echo "📊 Test Summary"
echo "================================"
echo "Total Tests:  $TOTAL_TESTS"
echo "Passed:       $PASSED_TESTS"
echo "Failed:       $FAILED_TESTS"

if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo "Success Rate: $SUCCESS_RATE%"
fi
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 All tests passed!"
    exit 0
else
    echo "⚠️  Some tests failed. Check the output above."
    exit 1
fi
