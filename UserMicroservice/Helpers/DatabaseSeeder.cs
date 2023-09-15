using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using UserMicroservice.Models.Database;
using UserMicroservice.Models;

namespace UserMicroservice.Helpers
{
    public class DatabaseSeeder
    {
        public async static Task SeedAsync(IServiceProvider serviceProvider)
        {
            var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetService<ApplicationDbContext>();

            string[] roles = new string[] { "Owner", "Administrator", "Moderator", "User", "Employee" };

            foreach (string role in roles)
            {
                var roleStore = new RoleStore<IdentityRole>(context);

                if (!context.Roles.Any(r => r.Name == role))
                {
                    await roleStore.CreateAsync(new IdentityRole
                    {
                        Name = role,
                        NormalizedName= role.ToUpper(),
                    });
                }
            }

            var user = new ApplicationUser
            {
                Email = "tihomirdiplomna@gmail.com",
                NormalizedEmail = "TIHOMIRDIPLOMNA@GMAIL.COM",
                UserName = "Admin",
                NormalizedUserName = "ADMIN",
                PhoneNumber = "",
                EmailConfirmed = true,
                PhoneNumberConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString("D"),
                UserInfo = new UserInfo
                {
                    FirstName = "Admin",
                    LastName = "Admin"
                },
                LockoutEnabled = true
            };

            if (!context.Users.Any(u => u.UserName == user.UserName))
            {
                var password = new PasswordHasher<ApplicationUser>();
                var hashed = password.HashPassword(user, "Adm!n123");
                user.PasswordHash = hashed;

                var userStore = new UserStore<ApplicationUser>(context);
                await userStore.CreateAsync(user);

                UserManager<ApplicationUser> _userManager = scope.ServiceProvider.GetService<UserManager<ApplicationUser>>()!;
                var result = await _userManager.AddToRolesAsync(user, new string[] { "Administrator", "User" });
            }
        }
    }
}
