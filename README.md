# Domestic Airlines Training Platform

A web-based training platform for flight crew. The first course is
**Upset Prevention & Recovery Training (UPRT)**, which follows ICAO Doc 10011.

## Features
- **Trainee sign-in** with name, staff ID and fleet/position
- **Learning path.** You must pass each module's knowledge check (80%) to unlock the next one.
- **Progress dashboard** that shows completion, best scores and time spent per module
- **Final exam** with 15 randomised questions and shuffled options
- **Printable certificate** with a certificate number
- **Instructor dashboard** (`/admin.html`) that lists every trainee's progress and exam result and can export CSV

## Run
```bash
dotnet run --project "upset recovery training domestic airlines.csproj"
```
Then open the URL it prints (for example http://localhost:5000).

## Configure
- `appsettings.json` → `Admin:Key`: the instructor dashboard password. **Change `change-me` before deploying.**
- Results are stored in `App_Data/attempts.json`. You can override the folder with `Storage:DataDirectory`.

## Content
- Courses, modules and questions are in `wwwroot/js/courses.js`. To add another course, add another entry to `COURSES`.
- Put images in `wwwroot/images/` and narration audio in `wwwroot/audio/`. The file names are listed per module in `courses.js`, and any missing media is hidden automatically.
- Logo: `wwwroot/images/domestic-airlines-logo.png`.

> Progress is kept in the trainee's browser and also sent to the server for the instructor view.
> This is not a secure authentication system. Use it on a trusted network, or put real sign-on (e.g. company SSO) in front of it.
