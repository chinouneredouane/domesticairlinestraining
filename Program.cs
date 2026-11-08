using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<AttemptStore>();

var app = builder.Build();

// Serve the training platform (wwwroot/index.html) and its assets.
app.UseDefaultFiles();
app.UseStaticFiles();

var api = app.MapGroup("/api");

api.MapGet("/health", () => Results.Ok(new { status = "ok" }));

// Record a quiz / exam attempt from a trainee.
api.MapPost("/attempts", async (AttemptInput input, AttemptStore store) =>
{
    var errors = input.Validate();
    if (errors.Count > 0) return Results.ValidationProblem(errors);

    var attempt = await store.AddAsync(input);
    return Results.Created($"/api/attempts/{attempt.Id}", attempt);
});

// A trainee's own history.
api.MapGet("/attempts", async (string traineeId, AttemptStore store) =>
    Results.Ok((await store.AllAsync())
        .Where(a => string.Equals(a.TraineeId, traineeId, StringComparison.OrdinalIgnoreCase))));

// Instructor view: every attempt. Requires the X-Admin-Key header.
api.MapGet("/admin/attempts", async (HttpRequest req, IConfiguration config, AttemptStore store) =>
{
    var key = config["Admin:Key"];
    if (string.IsNullOrEmpty(key) || req.Headers["X-Admin-Key"] != key)
        return Results.Unauthorized();
    return Results.Ok(await store.AllAsync());
});

app.Run();

record AttemptInput(
    string TraineeId,
    string TraineeName,
    string? Fleet,
    string CourseId,
    string ModuleId,
    string Kind,          // "quiz" or "exam"
    int Score,
    int Total,
    bool Passed)
{
    public Dictionary<string, string[]> Validate()
    {
        var e = new Dictionary<string, string[]>();
        if (string.IsNullOrWhiteSpace(TraineeId) || TraineeId.Length > 50) e["traineeId"] = ["Required, max 50 chars."];
        if (string.IsNullOrWhiteSpace(TraineeName) || TraineeName.Length > 100) e["traineeName"] = ["Required, max 100 chars."];
        if (Fleet is { Length: > 50 }) e["fleet"] = ["Max 50 chars."];
        if (string.IsNullOrWhiteSpace(CourseId) || CourseId.Length > 50) e["courseId"] = ["Required, max 50 chars."];
        if (string.IsNullOrWhiteSpace(ModuleId) || ModuleId.Length > 50) e["moduleId"] = ["Required, max 50 chars."];
        if (Kind is not ("quiz" or "exam")) e["kind"] = ["Must be 'quiz' or 'exam'."];
        if (Total <= 0 || Total > 200 || Score < 0 || Score > Total) e["score"] = ["Score must be between 0 and total."];
        return e;
    }
}

record Attempt(
    Guid Id, DateTimeOffset At,
    string TraineeId, string TraineeName, string? Fleet,
    string CourseId, string ModuleId, string Kind,
    int Score, int Total, bool Passed);

/// <summary>Stores attempts in a JSON file (App_Data/attempts.json). Simple and dependency-free.</summary>
class AttemptStore
{
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web) { WriteIndented = true };
    private readonly string _path;
    private readonly SemaphoreSlim _lock = new(1, 1);
    private List<Attempt>? _cache;

    public AttemptStore(IWebHostEnvironment env, IConfiguration config)
    {
        var dir = config["Storage:DataDirectory"] ?? Path.Combine(env.ContentRootPath, "App_Data");
        Directory.CreateDirectory(dir);
        _path = Path.Combine(dir, "attempts.json");
    }

    public async Task<IReadOnlyList<Attempt>> AllAsync()
    {
        await _lock.WaitAsync();
        try { return (await LoadAsync()).ToList(); }
        finally { _lock.Release(); }
    }

    public async Task<Attempt> AddAsync(AttemptInput i)
    {
        var attempt = new Attempt(Guid.NewGuid(), DateTimeOffset.UtcNow,
            i.TraineeId.Trim(), i.TraineeName.Trim(), i.Fleet?.Trim(),
            i.CourseId, i.ModuleId, i.Kind, i.Score, i.Total, i.Passed);

        await _lock.WaitAsync();
        try
        {
            var all = await LoadAsync();
            all.Add(attempt);
            var tmp = _path + ".tmp";
            await File.WriteAllTextAsync(tmp, JsonSerializer.Serialize(all, Json));
            File.Move(tmp, _path, overwrite: true);
        }
        finally { _lock.Release(); }
        return attempt;
    }

    private async Task<List<Attempt>> LoadAsync()
    {
        if (_cache != null) return _cache;
        _cache = File.Exists(_path)
            ? JsonSerializer.Deserialize<List<Attempt>>(await File.ReadAllTextAsync(_path), Json) ?? []
            : [];
        return _cache;
    }
}
