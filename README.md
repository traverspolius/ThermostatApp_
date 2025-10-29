# ThermostatApp (VS 2022) - Travers Polius 2025-10-28


ASP.NET Core (.NET 8) + EF Core (SQLite) + React + TypeScript + Tailwind.


## Prereqs
- Visual Studio 2022 (latest) with ASP.NET & web workload
- Node.js LTS (includes npm) — after install: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`


## Run (Visual Studio only)
1. Open the solution in VS 2022.
2. Right‑click project ▸ **Manage NuGet Packages…** and confirm `Microsoft.EntityFrameworkCore.Sqlite` + `Tools` are installed.
3. Tools ▸ **NuGet Package Manager** ▸ **Package Manager Console**:
```powershell
Add-Migration InitialCreate
Update-Database
