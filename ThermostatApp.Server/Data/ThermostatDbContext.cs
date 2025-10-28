namespace ThermostatApp.Server.Data
{
    using Microsoft.EntityFrameworkCore;
    using ThermostatApp.Server.Models;

    public class ThermostatDbContext(DbContextOptions<ThermostatDbContext> options) : DbContext(options)
    {
        public DbSet<Reading> Readings => Set<Reading>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Reading>(e =>
            {
                e.Property(r => r.Location).HasMaxLength(64);
                e.Property(r => r.Notes).HasMaxLength(256);
                e.HasIndex(r => r.CreatedAtUtc).HasDatabaseName("IX_Readings_CreatedAtUtc");
            });
        }
    }
}
