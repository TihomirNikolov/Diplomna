using LocationMicroservice.Models.Database;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace LocationMicroservice.Models
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Country> Countries { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
    }
}
