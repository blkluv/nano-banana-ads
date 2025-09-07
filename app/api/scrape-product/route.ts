import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { firecrawlService } from '@/lib/firecrawl';
import type { ScrapeResponse } from '@/lib/types';

const scrapeRequestSchema = z.object({
  url: z.string().url(),
});

export async function OPTIONS(request: NextRequest) {
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
    
    // Validar el request
    const validation = scrapeRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ScrapeResponse>(
        {
          success: false,
          error: "URL inválida",
        },
        { status: 400 }
      );
    }

    const { url } = validation.data;

    // Verificar si Firecrawl está disponible
    if (!firecrawlService.isAvailable()) {
      return NextResponse.json<ScrapeResponse>(
        {
          success: false,
          error: "Firecrawl no está configurado. Por favor usa el formulario manual para ingresar los datos del producto.",
        },
        { status: 503 }
      );
    }

    // Scrapear el producto
    const productData = await firecrawlService.scrapeProduct(url);

    return NextResponse.json<ScrapeResponse>({
      success: true,
      data: productData,
    });

  } catch (error) {
    console.error("Error in scrape-product API:", error);
    
    return NextResponse.json<ScrapeResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido al scrapear el producto",
      },
      { status: 500 }
    );
  }
}