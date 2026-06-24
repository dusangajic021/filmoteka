using Filmoteka.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 1. DODAJEMO CORS PRAVILO OVDE
builder.Services.AddCors(options =>
{
    options.AddPolicy("DozvoliReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Port na kom radi tvoj React
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 2. AKTIVIRAMO CORS OVDE (Obavezno iznad MapControllers!)
app.UseCors("DozvoliReact");

app.MapControllers();

app.Run();