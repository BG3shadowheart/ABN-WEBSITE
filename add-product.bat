@echo off
setlocal
cd /d "%~dp0"
title ABNORMAL - Add Product

echo.
echo =====================================================
echo        ABNORMAL - PRODUCT CREATOR
echo =====================================================
echo.
echo This wizard asks for category, product name, summary,
echo durations, and the prices you actually charge.
echo.
echo Example descriptions:
echo   PC:      Windows PC build with 1 Day and 1 Month access.
echo   Android: Android non-root build with 1 Day, 7 Days, or 30 Days access.
echo   iOS:     iPhone and iPad build with 1 Day or 1 Month access.
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js 20.9 or newer is required.
  echo Install the current Node.js LTS from https://nodejs.org and run this BAT again.
  pause
  exit /b 1
)
node "%~dp0scripts\add-product.mjs"
if errorlevel 1 (
  echo.
  echo Product was not saved. Check the message above and try again.
) else (
  echo.
  echo Done! The new product is now in src\data\custom-products.json.
)
echo.
echo If the local preview is running, refresh it. After deploying, rebuild the website.
pause
endlocal
