using System.ComponentModel.DataAnnotations;

namespace ThermostatApp.Server.Dtos
{
    public class CreateReadingDto
    {
        [Required]
        [Range(-50, 60)]
        public double TemperatureC { get; set; }

        [MaxLength(64)]
        public string? Location { get; set; }

        [MaxLength(256)]
        public string? Notes { get; set; }
    }
}
