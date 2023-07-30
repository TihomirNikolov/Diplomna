using SharedResources.Constants;
using ShoppingCartMicroservice.Interfaces;
using ShoppingCartMicroservice.Services;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var REDIS_HOST = Environment.GetEnvironmentVariable(EnvironmentVariables.REDIS_HOST);
var REDIS_PORT = Environment.GetEnvironmentVariable(EnvironmentVariables.REDIS_PORT);
var REDIS_PASSWORD = Environment.GetEnvironmentVariable(EnvironmentVariables.REDIS_PASSWORD);

var multiplexer = ConnectionMultiplexer.Connect($"{REDIS_HOST}:{REDIS_PORT},password={REDIS_PASSWORD}");
builder.Services.AddSingleton<IConnectionMultiplexer>(multiplexer);

builder.Services.AddScoped<IRedisService, RedisService>();
builder.Services.AddScoped<IShoppingCartService, ShoppingCartService>();

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("https://192.168.0.133:5173", "http://192.168.0.133:5173", "http://localhost:5173").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                      });
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

app.UseAuthorization();

app.MapControllers();

app.Run();
