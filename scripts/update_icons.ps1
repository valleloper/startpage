# Startpage Favicon Downloader for Windows
# This script downloads missing favicons for your dashboard links.

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$linksPath = Join-Path $PSScriptRoot "..\js\links.js"
$imgDir = Join-Path $PSScriptRoot "..\img"

if (!(Test-Path $linksPath)) {
    Write-Host "Error: Could not find js/links.js" -ForegroundColor Red
    return
}

if (!(Test-Path $imgDir)) {
    New-Item -ItemType Directory -Path $imgDir | Out-Null
}

Write-Host "--- Startpage Favicon Downloader (Windows) ---" -ForegroundColor Cyan

# Read links.js and extract URLs using regex
$content = Get-Content $linksPath -Raw
$matches = [regex]::Matches($content, '"url":\s*"([^"]+)"')
$urls = $matches.Groups | Where-Object { $_.Value -notlike '"url"*' } | Select-Object -ExpandProperty Value -Unique

Write-Host "Found $($urls.Count) unique URLs. Checking for missing icons..."

foreach ($url in $urls) {
    try {
        $uri = New-Object System.Uri($url)
        $domain = $uri.Host
        if ($domain -eq "localhost" -or [string]::IsNullOrWhiteSpace($domain)) { continue }
        
        $cleanDomain = $domain.Replace("www.", "")
        $fileName = "$cleanDomain.ico"
        $filePath = Join-Path $imgDir $fileName
        
        if (Test-Path $filePath) { continue }
        
        Write-Host "Downloading icon for $domain..."
        $apiUrl = "https://www.google.com/s2/favicons?domain=$domain&sz=64"
        
        Invoke-WebRequest -Uri $apiUrl -OutFile $filePath -TimeoutSec 10
        Write-Host " -> Saved: img/$fileName" -ForegroundColor Green
    }
    catch {
        Write-Host " -> Error downloading icon for $url" -ForegroundColor Yellow
    }
}

Write-Host "--- Done ---" -ForegroundColor Cyan
Write-Host "Press any key to close..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
