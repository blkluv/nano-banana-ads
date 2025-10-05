import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';
import type { Part } from '@google/genai';
import { fetchAndProcessImage } from '@/lib/image-utils';

// Configure maximum duration for this function
export const maxDuration = 300;

const createVariationRequestSchema = z.object({
  originalPrompt: z.object({}), // The original JSON prompt
  productData: z.object({
    title: z.string(),
    description: z.string(),
    price: z.string(),
    features: z.array(z.string()).optional(),
    imageUrl: z.string().optional(),
  }),
});

export async function OPTIONS() {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = createVariationRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
        },
        { status: 400 }
      );
    }

    const { originalPrompt, productData } = validation.data;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "La API de Gemini no está configurada",
        },
        { status: 503 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    try {
      console.log("Creando variación del anuncio...");
      
      // Create variation prompt
      const variationPrompt = `You are creating a VARIATION of an existing advertisement. 
      
Here is the original prompt that was used:
${JSON.stringify(originalPrompt, null, 2)}

Create a NEW JSON prompt for the SAME product but with a DIFFERENT creative approach. The variation should:
1. Keep the EXACT SAME product - do NOT change the product appearance in any way
2. Keep the same product information (name, price, features)
3. Use a DIFFERENT visual style (different background, colors, composition, mood)
4. Try a DIFFERENT marketing angle or emotional appeal
5. Use DIFFERENT typography styles and layouts
6. Change the background environment, effects, and overall design
7. Create a DIFFERENT overall look while keeping the product itself unchanged

REMEMBER: The product itself must look EXACTLY the same - only change everything around it!

Product context for the variation:
- Brand: ${productData.title.split(' ')[0] || 'Not specified'}
- Product: ${productData.title || 'Not specified'}
- Description: ${productData.description || 'Not specified'}
${productData.price ? `- Price: ${productData.price} (MUST include this exact price in the variation)` : ''}

IMPORTANT: 
- Generate a COMPLETELY DIFFERENT creative approach
- Do NOT copy the same style, colors, or composition from the original
- Return ONLY the JSON, no explanations
- Maintain the same JSON structure as the original
- All text must be 8 words or less
- NEVER include phone numbers or invent URLs`;

      // Generate new JSON prompt variation
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: variationPrompt,
        config: {
          temperature: 0.9, // Higher temperature for more variation
          responseMimeType: "application/json"
        }
      });
      
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('No response from AI');
      }
      console.log('📋 Variation prompt generated');
      
      // Parse the new JSON prompt
      let newPrompt;
      try {
        newPrompt = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing variation JSON:', parseError);
        throw new Error("No se pudo generar una variación válida");
      }
      
      // Generate image with the new prompt
      console.log('🎨 Generating variation image...');
      
      let contents: Part[];
      
      // If we have a product image URL, fetch and include it
      if (productData.imageUrl) {
        try {
          console.log('📥 Fetching product image for variation:', productData.imageUrl);
          const processedImage = await fetchAndProcessImage(productData.imageUrl);
          
          console.log('✅ Product image processed for variation, format:', processedImage.mimeType);
          
          // Create prompt with image - SAME product, different ad design
          contents = [
            { 
              text: `Generate a professional advertisement image based on this JSON specification: ${JSON.stringify(newPrompt)}
              
CRITICAL INSTRUCTION: The product shown in the advertisement MUST be EXACTLY the same as the product in the provided image. Do NOT change the product in any way. Only change the advertisement design, layout, colors, background, and text around the product. The product itself must remain identical to the provided image.` 
            },
            {
              inlineData: {
                mimeType: processedImage.mimeType,
                data: processedImage.base64,
              },
            },
          ];
        } catch (error) {
          console.error('⚠️ Error fetching product image for variation:', error);
          // Don't create variation without product image
          throw new Error(`Failed to fetch product image for variation. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        // No product image provided - variation requires original product
        throw new Error('Original product image is required to create a variation.');
      }
      
      const imageResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: contents,
      });

      // Extract the generated image
      if (imageResponse.candidates && imageResponse.candidates[0] && imageResponse.candidates[0].content && imageResponse.candidates[0].content.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            console.log('✅ Variación creada exitosamente');
            return NextResponse.json({
              success: true,
              imageBase64: part.inlineData.data,
              prompt: newPrompt,
            });
          }
        }
      }
      
      throw new Error("No se pudo generar la imagen de variación");
      
    } catch (error) {
      console.error("Error creando variación:", error);
      throw error;
    }

  } catch (error) {
    console.error("Error in create-variation API:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido al crear la variación",
      },
      { status: 500 }
    );
  }
}
