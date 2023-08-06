using Microsoft.EntityFrameworkCore;
using OrdersMicroservice.Models.Database;

namespace OrdersMicroservice.Models
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
    }
}
