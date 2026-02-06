# split_repos.ps1
$DesktopPath = "C:\Users\LENOVO\Desktop"
$FrontendPath = "$DesktopPath\money-manager-frontend"
$BackendPath = "$DesktopPath\money-manager-backend"
$SourcePath = "C:\Users\LENOVO\Desktop\ANTI_GRAVITY"

Write-Host "🚀 Starting Repository Split..." -ForegroundColor Cyan

# 1. Create Directories
if (Test-Path $FrontendPath) { Remove-Item $FrontendPath -Recurse -Force }
if (Test-Path $BackendPath) { Remove-Item $BackendPath -Recurse -Force }

New-Item -ItemType Directory -Path $FrontendPath | Out-Null
New-Item -ItemType Directory -Path $BackendPath | Out-Null

Write-Host "✅ Created new directories on Desktop." -ForegroundColor Green

# 2. Copy Frontend
Write-Host "📦 Copying Frontend files..." -ForegroundColor Yellow
Copy-Item -Path "$SourcePath\frontend\*" -Destination $FrontendPath -Recurse
# Copy root files meant for frontend if any (ignoring for now to be safe)

# 3. Copy Backend
Write-Host "📦 Copying Backend files..." -ForegroundColor Yellow
Copy-Item -Path "$SourcePath\backend\*" -Destination $BackendPath -Recurse

# 4. Initialize Git - Frontend
Write-Host "🔧 Initializing Frontend Git..." -ForegroundColor Magenta
Set-Location $FrontendPath
git init
git add .
git commit -m "Initial commit for hackathon"

# 5. Initialize Git - Backend
Write-Host "🔧 Initializing Backend Git..." -ForegroundColor Magenta
Set-Location $BackendPath
git init
git add .
git commit -m "Initial commit for hackathon"

Write-Host "`n🎉 DONE! Two new folders created on your Desktop:" -ForegroundColor Green
Write-Host "1. money-manager-frontend"
Write-Host "2. money-manager-backend"
Write-Host "`nNEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Create two new repos on GitHub."
Write-Host "2. Run 'git remote add origin <url>' inside each folder."
Write-Host "3. Run 'git push -u origin main' for each."
