using Microsoft.EntityFrameworkCore;
using ThermostatApp.Server.Data;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore.Sqlite;
using Microsoft.AspNetCore.SpaServices.Extensions;
using Microsoft.AspNetCore.Cors;

var builder = WebApplication.CreateBuilder(args);

var allowedSpa = "https://localhost:51281"; 

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.WithOrigins(allowedSpa)
              .AllowAnyHeader()
              .AllowAnyMethod();
        // If you need cookies/auth later, also add: .AllowCredentials()
    });
});
var cs = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=thermostat.db";
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

app.UseCors("DevCors");

app.MapControllers();
app.MapFallbackToFile("index.html");
app.Run();