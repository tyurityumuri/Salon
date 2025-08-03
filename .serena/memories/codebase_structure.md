# Codebase Structure

## Directory Layout
```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Home page
│   ├── stylists/     # Stylist pages
│   ├── styles/       # Style gallery
│   ├── menu/         # Menu and pricing
│   ├── access/       # Access information
│   ├── booking/      # Booking page
│   ├── admin/        # Admin management system
│   └── api/          # API routes
├── components/       # React components
├── data/            # JSON data files
├── types/           # TypeScript type definitions
├── lib/             # Firebase, S3, utilities
└── utils/           # Helper functions
```

## Key Components
- **Layout.tsx**: Main site layout with Header/Footer
- **AdminLayout.tsx**: Admin panel layout
- **Header.tsx**: Navigation and mobile menu
- **Footer.tsx**: Site footer
- **ScrollAnimation.tsx**: Scroll-triggered animations
- **MasonryGrid.tsx**: Gallery layout component
- **BookingForm.tsx**: Reservation form
- **ImageUpload.tsx**: S3 image upload component

## Data Structure
- All data currently stored in JSON files under `src/data/`
- API routes provide CRUD operations for each data type
- Types defined in `src/types/index.ts`
- Firebase Firestore integration ready for production

## API Structure
- RESTful API routes under `/api/`
- Consistent CRUD patterns for all resources
- Data validation and error handling
- S3 upload endpoint for image management