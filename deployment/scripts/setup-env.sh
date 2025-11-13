#!/bin/bash

# Environment Setup Script
# This script helps set up environment variables for local development

echo "🔧 MERN Todo - Environment Setup"
echo "=================================="
echo ""

# Function to generate random secret
generate_secret() {
    openssl rand -hex 64 2>/dev/null || node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
}

# Setup Backend Environment
echo "Setting up backend environment..."
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    
    # Generate JWT secret
    JWT_SECRET=$(generate_secret)
    
    # Replace placeholder with generated secret
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/your_super_secret_jwt_key_change_this_in_production/$JWT_SECRET/" backend/.env
    else
        sed -i "s/your_super_secret_jwt_key_change_this_in_production/$JWT_SECRET/" backend/.env
    fi
    
    echo "✅ Backend .env created"
    echo "⚠️  Please update MONGODB_URI in backend/.env with your MongoDB connection string"
else
    echo "⚠️  backend/.env already exists, skipping..."
fi

echo ""

# Setup Frontend Environment
echo "Setting up frontend environment..."
if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Frontend .env created"
else
    echo "⚠️  frontend/.env already exists, skipping..."
fi

echo ""
echo "=================================="
echo "Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your MongoDB URI"
echo "2. Run 'cd backend && npm install && npm run dev'"
echo "3. In a new terminal, run 'cd frontend && npm install && npm run dev'"
echo ""