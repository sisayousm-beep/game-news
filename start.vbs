' LOGIA launcher: start backend + frontend HIDDEN (no console windows), then open browser.
' Double-click this (or the desktop shortcut). To stop the servers, run stop.vbs.
Option Explicit
Dim sh, fso, folder
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
folder = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = folder

' 0 = hidden window, False = do not wait. CurrentDirectory is inherited by the child.
sh.Run "cmd /c cd backend && .venv\Scripts\python.exe -m uvicorn app.main:app --port 8000", 0, False
sh.Run "cmd /c cd frontend && npm run dev", 0, False

' Give the servers time to boot, then open the site in the default browser.
WScript.Sleep 13000
sh.Run "rundll32 url.dll,FileProtocolHandler http://localhost:3000", 1, False
