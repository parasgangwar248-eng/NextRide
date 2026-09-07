# NextRide - Push to GitHub Helper Script
# Usage: .\push-to-github.ps1 -RepoUrl "https://github.com/parasgangwar248-eng/nextride.git"

param (
    [string]$RepoUrl = ""
)

if (-not $RepoUrl) {
    Write-Host "Please provide your GitHub repository URL." -ForegroundColor Yellow
    Write-Host "Example: .\push-to-github.ps1 -RepoUrl https://github.com/parasgangwar248-eng/nextride.git" -ForegroundColor Cyan
    $RepoUrl = Read-Host "Enter GitHub Repository URL"
}

if ($RepoUrl) {
    Write-Host "Setting remote origin to $RepoUrl..." -ForegroundColor Green
    git remote remove origin 2>$null
    git remote add origin $RepoUrl
    git branch -M main
    Write-Host "Pushing to main branch..." -ForegroundColor Green
    git push -u origin main
    Write-Host "Successfully pushed NextRide to GitHub!" -ForegroundColor Green
}
