namespace ThermostatApp.Server.Dtos
{
    public class ReadingDto
    {
        public int Id { get; init; }
        public double TemperatureC { get; init; }
        public string? Location { get; init; }
        public string? Notes { get; init; }
        public DateTime CreatedAtUtc { get; init; }
    }
}
