#!/bin/bash

echo "🚀 Setting up VIT News Platform..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env from example..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your MongoDB connection string!"
fi

if [ ! -f frontend/.env.local ]; then
    echo "📝 Creating frontend/.env.local from example..."
    cp frontend/.env.local.example frontend/.env.local
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your MongoDB connection string"
echo "2. Make sure MongoDB is running"
echo "3. Run 'npm run dev' to start the application"
echo ""
echo "See QUICKSTART.md for detailed instructions."


