@echo off
title Push Telangana to GitHub
color 0E

echo ===================================================================
echo   PUSHING TELANGANA TO GITHUB
echo   Repository: https://github.com/shresthasrii/India_INC_TL.git
echo ===================================================================
echo.

cd /d "%~dp0"

if not exist ".git" (
    echo [INFO] Initializing git repository...
    git init
    git branch -M main
)

echo [INFO] Adding files and creating commit...
git add .
git commit -m "Telangana - Land of Heritage release" 2>nul

echo [INFO] Checking remote origin...
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    git remote add origin https://shresthasrii@github.com/shresthasrii/India_INC_TL.git
)

echo [INFO] Running: git push -u origin main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ===================================================================
    echo [SUCCESS] Successfully pushed Telangana to GitHub!
    echo ===================================================================
) else (
    echo.
    echo ===================================================================
    echo [NOTE] If a GitHub sign-in window or prompt appeared, please complete sign-in.
    echo ===================================================================
)

echo.
pause
