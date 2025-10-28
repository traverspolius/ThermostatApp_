using Microsoft.EntityFrameworkCore;
using ThermostatApp.Server.Data;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore.Sqlite;
using Microsoft.AspNetCore.SpaServices.Extensions;

var builder = WebApplication.CreateBuilder(args);
var cs = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=thermostat.db";

// ... rest of your code remains unchanged
builder.Services.AddDbContext<ThermostatDbContext>(o => o.UseSqlite(cs));
builder.Services.AddControllers();
builder.Services.AddSpaStaticFiles(c => c.RootPath = "thermostatapp.client/dist");

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ThermostatDbContext>();
    db.Database.Migrate();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSpaStaticFiles();
app.MapControllers();
app.MapFallbackToFile("index.html");
app.Run();