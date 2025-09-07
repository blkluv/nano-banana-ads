# CLAUDE.md - Project Documentation for AI Assistants

## Project Overview
This is a Next.js 15 application that generates professional advertising images using Google's Gemini AI. The application is designed for the Google Hackathon using the nano-banana (Gemini Image Preview) model.

## Key Features
- URL scraping with Firecrawl (optional)
- Manual product data entry
- AI-powered ad generation using Gemini 2.5 Flash for prompts and nano-banana for images
- Image editing capabilities (text removal, variations)
- Logo integration
- Modern UI with shadcn/ui and Tailwind CSS

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **AI Integration**: Google Gemini AI (@google/genai)
- **Web Scraping**: Firecrawl (optional)
- **Forms**: React Hook Form + Zod
- **Image Processing**: Sharp, Fabric.js

## Project Structure
```
/app
  /api
    /generate-ad      # Generates ads with Gemini
    /scrape-product   # Extracts data with Firecrawl
    /edit-image       # Edit existing images
    /remove-text      # Remove text from images
    /create-variation # Create variations of ads
  layout.tsx
  page.tsx           # Main page
/components
  /ui               # shadcn/ui components
  /magicui          # Custom UI effects
  GeneratedAd.tsx   # Displays generated ad
  ProductForm.tsx   # Manual form
  UrlInput.tsx      # URL input
  LogoEditor.tsx    # Logo editing
/lib
  firecrawl.ts     # Firecrawl client
  gemini.ts        # Gemini AI client
  image-utils.ts   # Image processing
  types.ts         # TypeScript types
  utils.ts         # Utilities
```

## Environment Variables
Required in `.env.local`:
- `GEMINI_API_KEY`: Google Gemini API key (required)
- `FIRECRAWL_API_KEY`: Firecrawl API key (optional)

## Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Testing
No specific test framework is currently configured. To add tests:
1. Install testing dependencies (Jest, React Testing Library, etc.)
2. Create test files alongside components
3. Add test scripts to package.json

## Build & Deploy Notes
- The project uses Next.js Turbopack for faster builds
- Deployed on Vercel (see vercel.json for configuration)
- Uses Node.js 20+ runtime
- Tailwind CSS v4 with PostCSS

## Key API Endpoints
1. **POST /api/scrape-product**: Scrapes product data from URL
2. **POST /api/generate-ad**: Generates ad with AI
3. **POST /api/edit-image**: Edits existing image
4. **POST /api/remove-text**: Removes text from image
5. **POST /api/create-variation**: Creates new variation

## AI Integration Details
- **Prompt Generation**: Gemini 2.5 Flash
- **Image Generation**: nano-banana (Gemini Image Preview)
- **Image Input**: Supports product images via URL
- **Output**: Base64 encoded images

## Common Issues & Solutions
1. **Missing API Keys**: Ensure GEMINI_API_KEY is set
2. **Firecrawl Errors**: App works without it using manual form
3. **Image Generation Fails**: Check product image URL is accessible
4. **Build Errors**: Ensure Node.js 20+ and all dependencies installed

## Future Enhancements
- Add user authentication
- Implement image caching
- Add more ad templates
- Support batch generation
- Analytics dashboard
- A/B testing features

## Security Considerations
- API keys stored in environment variables
- No user data persistence
- Input validation with Zod
- Safe image processing with Sharp
- CORS configured for API routes

## Performance Optimizations
- Turbopack for faster development
- Image optimization with Sharp
- Component lazy loading where appropriate
- Efficient state management
- Minimal client-side JavaScript

## Contribution Guidelines
1. Follow existing code style
2. Use TypeScript strict mode
3. Add proper error handling
4. Update types when changing APIs
5. Test all features before committing
6. Use semantic commit messages

## Notes for AI Assistants
- Always check for existing patterns before adding new code
- The project uses absolute imports with `@/` prefix
- UI components are in `/components/ui`
- Business logic belongs in `/lib`
- API routes handle all external integrations
- Error handling should be user-friendly
- The app is designed for demo purposes without auth