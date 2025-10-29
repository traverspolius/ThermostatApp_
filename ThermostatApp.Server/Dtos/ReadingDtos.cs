using System.ComponentModel.DataAnnotations;

namespace ThermostatApp.Server.Dtos;

public record CreateReadingDto(
    [property: Required, Range(-50, 60)] double TemperatureC,
    [property: MaxLength(64)] string? Location,
    [property: MaxLength(256)] string? Notes
);


public record ReadingDto(
    int Id,
    double TemperatureC,
    string? Location,
    string? Notes,
    DateTime CreatedAtUtc
);