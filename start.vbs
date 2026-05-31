' LOGIA launcher: stop any old servers first, then start backend + frontend
' HIDDEN (no console windows), then open the browser.
' Double-click this (or the desktop shortcut). To stop the servers, run stop.vbs.
Option Explicit
Dim sh, fso, folder
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
folder = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = folder

' 1) Clean slate: kill any previous LOGIA servers. The frontend dev server falls
'    back to 3001/3002/... when 3000 is busy, so a stale instance left running makes
'    Next serve mismatched chunks ("missing required error components"). Free the whole
'    fallback range + backend, and wait (True) until done before starting fresh.
sh.Run "powershell -NoProfile -WindowStyle Hidden -Command ""foreach($p in 8000,3000,3001,3002,3003,3004,3005){ Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } }; Start-Sleep -Milliseconds 700""", 0, True

' 2) Start backend + frontend. 0 = hidden window, False = do not wait.
sh.Run "cmd /c cd backend && .venv\Scripts\python.exe -m uvicorn app.main:app --port 8000", 0, False
sh.Run "cmd /c cd frontend && npm run dev", 0, False

' 3) Give the servers time to boot, then open the site in the default browser.
WScript.Sleep 13000
sh.Run "rundll32 url.dll,FileProtocolHandler http://localhost:3000", 1, False
