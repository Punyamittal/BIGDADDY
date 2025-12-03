@echo off
echo 🚀 Setting up VIT News Platform...

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

REM Create .env files if they don't exist
if not exist backend\.env (
    echo 📝 Creating backend\.env from example...
    copy backend\.env.example backend\.env
    echo ⚠️  Please update backend\.env with your MongoDB connection string!
)

if not exist frontend\.env.local (
    echo 📝 Creating frontend\.env.local from example...
    copy frontend\.env.local.example frontend\.env.local
)

echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Update backend\.env with your MongoDB connection string
echo 2. Make sure MongoDB is running
echo 3. Run 'npm run dev' to start the application
echo.
echo See QUICKSTART.md for detailed instructions.

pause


