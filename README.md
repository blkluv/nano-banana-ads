# AI Ad Generator - Google Hackathon

A Next.js application that generates professional advertising ads using Google Gemini AI. Allows extracting product information from URLs using Firecrawl (optional) or entering it manually.

## Features

- 🔗 **URL Scraping**: Automatically extracts product information using Firecrawl
- ✏️ **Manual Entry**: Complete form to enter data manually if Firecrawl is not available
- 🤖 **Generative AI**: Uses Gemini 2.5 Flash to generate prompts and Gemini Image Preview (nano-banana) to create images
- 🎨 **Professional Design**: Modern interface with shadcn/ui and Tailwind CSS
- 💾 **Download and Share**: Download or share the generated ads
- 🏢 **Custom Logos**: Include your company logo in the ads

## Technologies

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Google Gemini AI (@google/genai)
- Firecrawl (optional)
- React Hook Form + Zod

## Installation

1. Clone the repository:
```bash
git clone [your-repository]
cd nano-banana-hackaton
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your API keys:
```env
GEMINI_API_KEY=your_gemini_key_here
FIRECRAWL_API_KEY=your_firecrawl_key_here_optional
```

## How to Get API Keys

### Google Gemini API Key (Required)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API Key
4. Copy the key and paste it in `.env.local`

### Firecrawl API Key (Optional)
1. Go to [Firecrawl.dev](https://www.firecrawl.dev/)
2. Create a free account
3. Get your API Key from the dashboard
4. Copy the key and paste it in `.env.local`

*Note: If you don't have Firecrawl, the app will work perfectly with the manual form*

## Usage

1. Run the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Choose between two modes:
   - **Product URL**: Paste the URL of any online product
   - **Manual Entry**: Complete the form with product data

4. Optionally, upload your company logo

5. Click "Generate Ad" and wait while the AI creates your ad

6. Once generated, you can:
   - Download the image
   - Share it
   - View the AI-generated prompt

## Project Structure

```
/app
  /api
    /generate-ad      # Generates ads with Gemini
    /scrape-product   # Extracts data with Firecrawl
  layout.tsx
  page.tsx           # Main page
/components
  /ui               # shadcn/ui components
  GeneratedAd.tsx   # Displays the generated ad
  ProductForm.tsx   # Manual form
  UrlInput.tsx      # URL input
/lib
  firecrawl.ts     # Firecrawl client
  gemini.ts        # Gemini AI client
  types.ts         # TypeScript types
```

## Application Flow

1. **Data Extraction**:
   - With URL: Firecrawl → Structured data
   - Manual: Form → Structured data

2. **Prompt Generation**:
   - Data → Gemini 2.5 Flash → Structured JSON prompt

3. **Image Generation**:
   - Prompt + Logo → Gemini Image Preview → Ad image

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Run in production
npm start

# Check types
npm run type-check

# Run linter
npm run lint
```

## Demo

This is a demo application for Google's hackathon. It doesn't require user authentication and is optimized to demonstrate image generation capabilities with Gemini AI.

## License

MIT
