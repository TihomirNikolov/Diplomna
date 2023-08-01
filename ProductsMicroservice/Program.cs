using Microsoft.Extensions.FileProviders;
using MongoDB.Driver;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Services;
using SharedResources.Constants;
using StackExchange.Redis;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var configuration = builder.Configuration;

var REDIS_HOST = Environment.GetEnvironmentVariable(EnvironmentVariables.REDIS_HOST);
var REDIS_PORT = Environment.GetEnvironmentVariable(EnvironmentVariables.REDIS_PORT);
var REDIS_PASSWORD = Environment.GetEnvironmentVariable(EnvironmentVariables.REDIS_PASSWORD);

var multiplexer = ConnectionMultiplexer.Connect($"{REDIS_HOST}:{REDIS_PORT},password={REDIS_PASSWORD}");
builder.Services.AddSingleton<IConnectionMultiplexer>(multiplexer);

string connectionUri = configuration.GetConnectionString("MongoDBConnectionString")!;

var settings = MongoClientSettings.FromConnectionString(connectionUri);
settings.ServerApi = new ServerApi(ServerApiVersion.V1);
builder.Services.AddSingleton<IMongoClient>(new MongoClient(connectionUri));

builder.Services.AddScoped<ICategoriesService, CategoriesService>();
builder.Services.AddScoped<IProductsService, ProductsService>();
builder.Services.AddScoped<IFavouritesService, FavouritesService>();
builder.Services.AddScoped<IRedisService, RedisService>();

builder.Services.AddHttpClient();

builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

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

if (!Directory.Exists(Path.Combine(builder.Environment.ContentRootPath, "Files")))
{
    Directory.CreateDirectory(Path.Combine(builder.Environment.ContentRootPath, "Files"));
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "Files")),
    RequestPath = "/Files"
});

app.UseAuthorization();

app.MapControllers();

app.Run();
