# Essential Development Commands

## Package Management
```bash
npm install                    # Install dependencies
```

## Development Server
```bash
npm run dev                   # Start development server (http://localhost:3000)
```

## Build and Deployment
```bash
npm run build                 # Build production bundle
npm run start                 # Start production server
```

## Code Quality
```bash
npm run lint                  # Run ESLint
npm run type-check           # Run TypeScript type checking
```

## S3 Management Scripts
```bash
npm run s3:setup             # Setup S3 data structure
npm run s3:validate          # Validate S3 data integrity
npm run s3:backup            # Backup data to S3
npm run s3:cors              # Configure S3 CORS settings
```

## System Commands (macOS)
```bash
ls                           # List directory contents
cd [directory]               # Change directory
grep [pattern] [file]        # Search text patterns
find [path] -name [pattern]  # Find files by name
git status                   # Check git status
git add .                    # Stage all changes
git commit -m "message"      # Commit changes
```

## Admin Access
- **URL**: http://localhost:3001/admin
- **Username**: admin
- **Password**: salon123

## Ports
- **Development**: http://localhost:3000
- **Admin**: http://localhost:3001/admin (same port, different route)