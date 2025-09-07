import { z } from 'zod';

// Esquema para los datos del producto
export const ProductDataSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.string().min(1, "El precio es requerido"),
  features: z.array(z.string()),
  imageUrl: z.string().url("URL de imagen inválida").or(z.literal("")),
});

export type ProductData = z.infer<typeof ProductDataSchema>;

// Esquema para el prompt de anuncio generado por Gemini
export const AdPromptSchema = z.object({
  style: z.string(),
  background: z.string(),
  mainElements: z.string(),
  text: z.object({
    headline: z.string(),
    tagline: z.string(),
    callToAction: z.string(),
  }),
  colors: z.string(),
  composition: z.string(),
  mood: z.string(),
});

export type AdPrompt = z.infer<typeof AdPromptSchema>;

// Tipo para la respuesta de la API de scraping
export interface ScrapeResponse {
  success: boolean;
  data?: ProductData;
  error?: string;
}

// Tipo para la respuesta de generación de anuncio
export interface GenerateAdResponse {
  success: boolean;
  imageBase64?: string;
  prompt?: AdPrompt;
  error?: string;
}

// Estados de la aplicación
export type AppStatus = 'idle' | 'scraping' | 'generating' | 'success' | 'error';

// Configuración del formulario manual
export const ManualProductFormSchema = ProductDataSchema.extend({
  imageFile: z.instanceof(File).optional().or(z.undefined()),
});

export type ManualProductFormData = z.infer<typeof ManualProductFormSchema>;

// Tipo para el modo de entrada
export type InputMode = 'url' | 'manual';

// Configuración de la aplicación
export interface AppConfig {
  firecrawlEnabled: boolean;
  geminiEnabled: boolean;
}