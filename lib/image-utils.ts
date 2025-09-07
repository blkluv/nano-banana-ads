import sharp from 'sharp';

// Gemini supported image formats
const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export interface ProcessedImage {
  base64: string;
  mimeType: string;
}

/**
 * Validates and converts images to Gemini-supported formats
 */
export async function processImageForGemini(
  imageBuffer: ArrayBuffer | Buffer,
  originalMimeType: string
): Promise<ProcessedImage> {
  const buffer = Buffer.isBuffer(imageBuffer) 
    ? imageBuffer 
    : Buffer.from(imageBuffer);

  // Check if the format is already supported
  if (SUPPORTED_MIME_TYPES.includes(originalMimeType)) {
    return {
      base64: buffer.toString('base64'),
      mimeType: originalMimeType
    };
  }

  console.log(`⚠️ Unsupported image format: ${originalMimeType}, converting to JPEG...`);

  try {
    // Convert to JPEG using sharp
    const convertedBuffer = await sharp(buffer)
      .jpeg({ quality: 90 })
      .toBuffer();

    return {
      base64: convertedBuffer.toString('base64'),
      mimeType: 'image/jpeg'
    };
  } catch (error) {
    console.error('Error converting image:', error);
    throw new Error(`Failed to convert image from ${originalMimeType} to JPEG`);
  }
}

/**
 * Fetches and processes an image from URL
 */
export async function fetchAndProcessImage(imageUrl: string): Promise<ProcessedImage> {
  const response = await fetch(imageUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }
  
  const imageBuffer = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  
  return processImageForGemini(imageBuffer, contentType);
}