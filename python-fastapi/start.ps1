# 自动使用本目录 .venv，不必先 activate
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$python = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"

if (-not (Test-Path $python)) {
  Write-Host "[python] 未找到 .venv，正在创建并安装依赖..."
  python -m venv .venv
  & $python -m pip install -r requirements.txt
}

& $python main.py
