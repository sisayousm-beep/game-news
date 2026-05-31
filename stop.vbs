' LOGIA stopper: kills whatever is serving on ports 8000 (backend) and 3000 (frontend).
Option Explicit
Dim sh
Set sh = CreateObject("WScript.Shell")
sh.Run "powershell -NoProfile -WindowStyle Hidden -Command ""1..2 | ForEach-Object { foreach($p in 8000,3000){ Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } }; Start-Sleep -Milliseconds 600 }""", 0, True
