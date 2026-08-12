@echo off
echo ============================================
echo Soft Services ERP - Database Setup
echo ============================================
echo.

REM Check if PostgreSQL is running
pg_isready -h localhost -p 5432 >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL is not running on localhost:5432
    echo.
    echo Please install PostgreSQL first:
    echo   Option 1: Download from https://www.postgresql.org/download/windows/
    echo   Option 2: Use Chocolatey (run as admin): choco install postgresql15
    echo.
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo PostgreSQL is running!
echo.

REM Create database if not exists
echo Creating database 'soft_services_erp'...
psql -U postgres -c "CREATE DATABASE soft_services_erp;" 2>nul
if %errorlevel% equ 0 (
    echo Database created successfully!
) else (
    echo Database may already exist, continuing...
)
echo.

REM Push Prisma schema
echo Pushing Prisma schema to database...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ERROR: Failed to push schema
    pause
    exit /b 1
)
echo.

REM Seed the database
echo Seeding database with initial data...
call npm run db:seed
if %errorlevel% neq 0 (
    echo ERROR: Failed to seed database
    pause
    exit /b 1
)
echo.

echo ============================================
echo Database setup complete!
echo ============================================
echo.
echo Default admin credentials:
echo   Email: admin@softservices.com
echo   Password: admin123
echo.
echo You can now access the app at http://localhost:3000
echo.
pause
