using UserMicroservice.Hangfire.Filters;
using Hangfire;
using Hangfire.Dashboard;
using Hangfire.Dashboard.BasicAuthorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using System.Text;
using UserMicroservice.Authentication;
using UserMicroservice.Authentication.Helpers;
using UserMicroservice.Authentication.Models.Database;
using UserMicroservice.Helpers;
using UserMicroservice.Helpers.Constants;
using UserMicroservice.Interfaces.Services;
using UserMicroservice.Interfaces.Services.Database;
using UserMicroservice.Mappers;
using UserMicroservice.Services;
using UserMicroservice.Services.Database;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var configuration = builder.Configuration;

builder.Services.AddScoped<AuthenticationHelper>();
builder.Services.AddScoped<HangfireHelper>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IUsersService, UsersService>();

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("ConnectionString")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
     .AddEntityFrameworkStores<ApplicationDbContext>()
     .AddDefaultTokenProviders();

MigrationDatabaseHelper.MigrateHangfireDatabas(configuration.GetConnectionString("BasicConnectionString"));

builder.Services.AddHangfire(options => options
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(configuration.GetConnectionString("HangfireConnectionString")));

builder.Services.AddHangfireServer();

builder.Services.AddAutoMapper(
    (options) =>
    {
        options.AddProfile<RefreshTokenProfile>();
    });

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://192.168.0.133:5173").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                      });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero,

            ValidAudience = configuration["JWT:ValidAudience"],
            ValidIssuer = configuration["JWT:ValidIssuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]!))
        };
        options.Events = new JwtBearerEvents()
        {
            OnMessageReceived = (context) =>
            {
                var bearerToken = context.HttpContext.Request.Headers[HeaderConstants.Authorization].ToString().Replace("Bearer ", "");
                if (bearerToken != null && !string.IsNullOrEmpty(bearerToken))
                {
                    context.Token = bearerToken;
                    return Task.CompletedTask;
                }

                var cookieToken = context.HttpContext.Request.Cookies[CookieConstants.AccessToken];
                if (cookieToken != null && !string.IsNullOrEmpty(cookieToken))
                {
                    context.Token = cookieToken;
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

IDashboardAuthorizationFilter filter;

if (app.Environment.IsDevelopment())
{
    filter = new DevelopmentAuthorizationFilter();
}
else
{
    filter = new BasicAuthAuthorizationFilter(new BasicAuthAuthorizationFilterOptions
    {
        RequireSsl = true,
        LoginCaseSensitive = true,
        Users = new[]
            {
                new BasicAuthAuthorizationUser
                {
                    Login = configuration["Hangfire:Username"],
                    PasswordClear =  configuration["Hangfire:Password"]
                }
            }
    });
}

app.UseHangfireDashboard("/dashboard", new DashboardOptions
{
    Authorization = new[] { filter }
});


app.MapControllers();

using (var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
{
    var context = serviceScope.ServiceProvider.GetService<ApplicationDbContext>();
    context?.Database.Migrate();
}

app.Run();
