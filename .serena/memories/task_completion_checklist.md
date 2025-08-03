# Task Completion Checklist

## Before Committing Code

### 1. Code Quality Checks
```bash
npm run lint                 # Fix all ESLint errors
npm run type-check          # Fix all TypeScript errors
npm run build               # Ensure build succeeds
```

### 2. Testing
- Manually test changes in development server
- Test responsive design on mobile/desktop
- Verify admin functionality if affected
- Test image uploads if S3 features modified

### 3. Environment Considerations
- Ensure .env.local is properly configured
- Check that Firebase and S3 credentials are valid
- Verify API routes work correctly

## Deployment Checklist

### 1. Pre-deployment
- All tests pass
- No console errors in browser
- Image optimization completed
- Performance metrics acceptable

### 2. Vercel Deployment
- Environment variables configured in Vercel dashboard
- Build succeeds on Vercel
- Production URLs functional

### 3. Post-deployment
- Admin panel accessible
- Image uploads working
- All pages load correctly
- Mobile responsiveness verified

## Code Review Standards
- Components are properly typed
- No hardcoded values where configuration should be used
- Consistent with existing code style
- Japanese comments for UI elements, English for technical comments
- Proper error handling implemented