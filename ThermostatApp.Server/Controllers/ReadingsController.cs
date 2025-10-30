using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ThermostatApp.Server.Data;
using ThermostatApp.Server.Dtos;
using ThermostatApp.Server.Models;

[ApiController]
[Route("api/[controller]")]
public class ReadingsController : ControllerBase
{
    private readonly ThermostatDbContext _db;

    public ReadingsController(ThermostatDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<ActionResult<ReadingDto>> Create([FromBody] CreateReadingDto dto)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var reading = new Reading
        {
            TemperatureC = dto.TemperatureC,
            Location = string.IsNullOrWhiteSpace(dto.Location) ? null : dto.Location.Trim(),
            Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes.Trim(),
            CreatedAtUtc = DateTime.UtcNow
        };

        _db.Readings.Add(reading);
        await _db.SaveChangesAsync();

        var result = new ReadingDto
        {
            Id = reading.Id,
            TemperatureC = reading.TemperatureC,
            Location = reading.Location,
            Notes = reading.Notes,
            CreatedAtUtc = reading.CreatedAtUtc
        };

        // 201 Created
        return CreatedAtAction(
            nameof(Get),
            new { take = 1 },
            result
        );
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReadingDto>>> Get([FromQuery] int take = 20)
    {
        take = Math.Clamp(take, 1, 200);

        var items = await _db.Readings
            .OrderByDescending(r => r.CreatedAtUtc)
            .Take(take)
            .Select(r => new ReadingDto
            {
                Id = r.Id,
                TemperatureC = r.TemperatureC,
                Location = r.Location,
                Notes = r.Notes,
                CreatedAtUtc = r.CreatedAtUtc
            })
            .ToListAsync();

        return Ok(items);
    }
}
