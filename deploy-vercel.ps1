# NextRide - Deploy to Vercel Helper Script
# Runs production build check and deploys via npx vercel

Write-Host "Building NextRide for production..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build succeeded! Initiating Vercel deployment..." -ForegroundColor Green
    npx vercel
} else {
    Write-Host "Build failed. Please fix errors before deploying." -ForegroundColor Red
}
