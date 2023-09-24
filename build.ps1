$src = 'extension'
$bin = 'bin'

$targets = Get-ChildItem $src 'manifest.*.json' |
    Select-Object -ExpandProperty 'Name' |
    ForEach-Object { $_.Split('.')[1]  }

Write-Host 'Starting build...'
Write-Host "Output directory: $bin"

if (Test-Path $bin) {
    Write-Host 'Cleaning output directory...'
    Remove-Item (Join-Path $bin '*') -Recurse
} else {
    Write-Host 'Creating output directory...'
    New-Item $bin -ItemType 'Directory'
}

Write-Host 'Copying files to output directory...'
$srcFiles = Join-Path $src '*'
foreach ($target in $targets) {
    Write-Host "Processing target: $target..."
    $targetDir = Join-Path $bin $target
    New-Item $targetDir -ItemType 'Directory'
    Copy-Item $srcFiles $targetDir -Exclude 'manifest.json', 'manifest.*.json' -Recurse
    $manifest = Get-Content (Join-Path $src 'manifest.json') -Raw | ConvertFrom-Json -AsHashtable -NoEnumerate
    $targetManifest = Get-Content (Join-Path $src "manifest.$target.json") -Raw | ConvertFrom-Json -AsHashtable -NoEnumerate
    foreach ($key in $targetManifest.Keys) {
        $manifest[$key] = $targetManifest[$key]
    }
    ConvertTo-Json $manifest -Depth 100 | Set-Content (Join-Path $targetDir 'manifest.json')
}

Write-Host 'Build complete.'