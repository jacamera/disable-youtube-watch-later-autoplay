$src = 'extension'
$srcFiles = Join-Path $src '*'
$bin = 'bin'
$binMv2 = Join-Path $bin 'mv2'
$binMv3 = Join-Path $bin 'mv3'

Write-Host 'Starting build...'
Write-Host "Build directory: $bin"

if (Test-Path $bin) {
    Write-Host 'Cleaning build directory...'
    Remove-Item $(Join-Path $bin '*') -Recurse
} else {
    Write-Host 'Creating build directory...'
    New-Item $bin -ItemType Directory
}

Write-Host 'Copying files to build directory...'
New-Item $binMv2 -ItemType Directory
Copy-Item $srcFiles $binMv2 -Exclude 'manifest.*.json' -Recurse
Copy-Item $(Join-Path $src 'manifest.v2.json') $(Join-Path $binMv2 'manifest.json')

New-Item $binMv3 -ItemType Directory
Copy-Item $srcFiles $binMv3 -Exclude 'manifest.*.json' -Recurse
Copy-Item $(Join-Path $src 'manifest.v3.json') $(Join-Path $binMv3 'manifest.json')

Write-Host 'Build complete.'
