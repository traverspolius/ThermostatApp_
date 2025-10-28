namespace ThermostatApp.Server.Models
{
    using System.ComponentModel.DataAnnotations;

    public class Reading
    {
        public int Id { get; set; }

        [Required]
        [Range(-50, 60, ErrorMessage = "Temperature must be between -50 and 60 °C")]
        public double TemperatureC { get; set; }

        [MaxLength(64)] public string? Location { get; set; }
        [MaxLength(256)] public string? Notes { get; set; }

        public DateTime CreatedAtUtc { get; set; }
    }
}
