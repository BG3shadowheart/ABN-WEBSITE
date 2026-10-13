# Downloads one anime picture per theme into public\art\characters (no Node.js needed).
$ErrorActionPreference = 'Continue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$dir = Join-Path $PSScriptRoot '..\public\art\characters'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$slots = [ordered]@{
  anemo   = @('waifu', 0);    geo   = @('husbando', 0); electro = @('kitsune', 0); dendro = @('neko', 0)
  hydro   = @('waifu', 1);    pyro  = @('husbando', 1); cryo    = @('kitsune', 1)
}

$lists = @{}
foreach ($cat in 'waifu', 'husbando', 'kitsune', 'neko') {
  try {
    $r = Invoke-RestMethod "https://nekos.best/api/v2/${cat}?amount=2" -TimeoutSec 25
    $lists[$cat] = @($r.results)
  } catch {
    Write-Host "[art] $cat : $($_.Exception.Message)"
  }
}

$credits = @{}
foreach ($t in $slots.Keys) {
  $cat = $slots[$t][0]; $i = $slots[$t][1]
  $item = $null
  if ($lists.ContainsKey($cat) -and $lists[$cat].Count -gt $i) { $item = $lists[$cat][$i] }
  if (-not $item) { Write-Host "[art] $t : no picture available (offline?)"; continue }

  $ext = [IO.Path]::GetExtension(([Uri]$item.url).AbsolutePath)
  if (-not $ext) { $ext = '.png' }
  $target = Join-Path $dir "$t$ext"
  try {
    Invoke-WebRequest $item.url -OutFile $target -TimeoutSec 120
    Get-ChildItem $dir -Filter "$t.*" | Where-Object { $_.FullName -ne $target } | Remove-Item -Force
    $credits[$t] = @{ artist = $item.artist_name; link = $item.source_url }
    Write-Host "[art] saved $t$ext (art by $($item.artist_name))"
  } catch {
    Write-Host "[art] $t : download failed ($($_.Exception.Message))"
  }
}

$json = $credits | ConvertTo-Json -Depth 4
[IO.File]::WriteAllText((Join-Path $dir 'credits.json'), $json, (New-Object Text.UTF8Encoding $false))
Write-Host "[art] done."
