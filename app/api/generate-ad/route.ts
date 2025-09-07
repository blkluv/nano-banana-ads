import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateAdPrompt, generateAdvertisementImage } from '@/lib/gemini';
import { ProductDataSchema } from '@/lib/types';
import type { GenerateAdResponse } from '@/lib/types';

const generateAdRequestSchema = z.object({
  productData: ProductDataSchema,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar el request
    const validation = generateAdRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<GenerateAdResponse>(
        {
          success: false,
          error: "Datos del producto inválidos",
        },
        { status: 400 }
      );
    }

    const { productData } = validation.data;

    // Verificar que la API key de Gemini esté configurada
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json<GenerateAdResponse>(
        {
          success: false,
          error: "La API de Gemini no está configurada. Por favor configura GEMINI_API_KEY en las variables de entorno.",
        },
        { status: 503 }
      );
    }

    try {
      // Generar el prompt estructurado con Gemini
      console.log("Generando prompt con Gemini...");
      const adPrompt = await generateAdPrompt(productData);
      console.log("Prompt generado:", adPrompt);

      // Generar la imagen del anuncio
      console.log("Generando imagen del anuncio...");
      console.log("Product image URL:", productData.imageUrl);
      const imageBase64 = await generateAdvertisementImage(adPrompt, productData.imageUrl);
      console.log("Imagen generada exitosamente");

      return NextResponse.json<GenerateAdResponse>({
        success: true,
        imageBase64,
        prompt: adPrompt,
      });

    } catch (error) {
      console.error("Error generando anuncio:", error);
      
      // Manejar errores específicos de Gemini
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          return NextResponse.json<GenerateAdResponse>(
            {
              success: false,
              error: "Error de autenticación con Gemini. Verifica tu API key.",
            },
            { status: 401 }
          );
        }
        
        if (error.message.includes("quota") || error.message.includes("limit")) {
          return NextResponse.json<GenerateAdResponse>(
            {
              success: false,
              error: "Se ha excedido la cuota de la API de Gemini. Intenta más tarde.",
            },
            { status: 429 }
          );
        }

        // Handle image-related errors
        if (error.message.includes("imagen del producto") || error.message.includes("Image not found") || error.message.includes("Failed to fetch image")) {
          return NextResponse.json<GenerateAdResponse>(
            {
              success: false,
              error: error.message,
            },
            { status: 400 }
          );
        }
      }

      throw error;
    }

  } catch (error) {
    console.error("Error in generate-ad API:", error);
    
    return NextResponse.json<GenerateAdResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido al generar el anuncio",
      },
      { status: 500 }
    );
  }
}