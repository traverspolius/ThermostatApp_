using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ThermostatApp.Server.Data;
using ThermostatApp.Server.Dtos;
using ThermostatApp.Server.Models;

namespace ThermostatApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReadingsController(ThermostatDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ReadingDto>> Create([FromBody] CreateReadingDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var reading = new Reading
        {
            TemperatureC = dto.TemperatureC,
            Location = string.IsNullOrWhiteSpace(dto.Location) ? null : dto.Location.Trim(),
            Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes.Trim(),
            CreatedAtUtc = DateTime.UtcNow
        };

        try
        {
            db.Readings.Add(reading);
            await db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // log to console AND return problem details so you see it in the browser
            Console.WriteLine(ex);
            return Problem(title: "Failed to save reading", detail: ex.ToString(), statusCode: 500);
        }

        var result = new ReadingDto(reading.Id, reading.TemperatureC, reading.Location, reading.Notes, reading.CreatedAtUtc);
        return CreatedAtAction(nameof(Get), new { take = 1 }, result);
    }



    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReadingDto>>> Get([FromQuery] int take = 20)
    {
        take = Math.Clamp(take, 1, 200);
        var items = await db.Readings
        .OrderByDescending(r => r.CreatedAtUtc)
        .Take(take)
        .Select(r => new ReadingDto(r.Id, r.TemperatureC, r.Location, r.Notes, r.CreatedAtUtc))
        .ToListAsync();
        return Ok(items);
    }


}