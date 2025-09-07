# Generador de Anuncios con IA - Hackathon Google

Una aplicación Next.js que genera anuncios publicitarios profesionales usando Google Gemini AI. Permite extraer información de productos desde URLs usando Firecrawl (opcional) o ingresarla manualmente.

## Características

- 🔗 **Scraping de URLs**: Extrae automáticamente información de productos usando Firecrawl
- ✏️ **Entrada Manual**: Formulario completo para ingresar datos manualmente si Firecrawl no está disponible
- 🤖 **IA Generativa**: Usa Gemini 2.5 Flash para generar prompts y Gemini Image Preview (nano-banana) para crear imágenes
- 🎨 **Diseño Profesional**: Interfaz moderna con shadcn/ui y Tailwind CSS
- 💾 **Descarga y Compartir**: Descarga o comparte los anuncios generados
- 🏢 **Logos Personalizados**: Incluye el logo de tu empresa en los anuncios

## Tecnologías

- Next.js 15 con App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Google Gemini AI (@google/genai)
- Firecrawl (opcional)
- React Hook Form + Zod

## Instalación

1. Clona el repositorio:
```bash
git clone [tu-repositorio]
cd nano-banana-hackaton
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

4. Edita `.env.local` y agrega tus claves API:
```env
GEMINI_API_KEY=tu_clave_de_gemini_aqui
FIRECRAWL_API_KEY=tu_clave_de_firecrawl_aqui_opcional
```

## Cómo obtener las API Keys

### Google Gemini API Key (Requerida)
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API Key
4. Copia la clave y pégala en `.env.local`

### Firecrawl API Key (Opcional)
1. Ve a [Firecrawl.dev](https://www.firecrawl.dev/)
2. Crea una cuenta gratuita
3. Obtén tu API Key desde el dashboard
4. Copia la clave y pégala en `.env.local`

*Nota: Si no tienes Firecrawl, la app funcionará perfectamente con el formulario manual*

## Uso

1. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

2. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

3. Elige entre dos modos:
   - **URL del Producto**: Pega la URL de cualquier producto online
   - **Entrada Manual**: Completa el formulario con los datos del producto

4. Opcionalmente, sube el logo de tu empresa

5. Haz clic en "Generar Anuncio" y espera mientras la IA crea tu anuncio

6. Una vez generado, puedes:
   - Descargar la imagen
   - Compartirla
   - Ver el prompt generado por la IA

## Estructura del Proyecto

```
/app
  /api
    /generate-ad      # Genera anuncios con Gemini
    /scrape-product   # Extrae datos con Firecrawl
  layout.tsx
  page.tsx           # Página principal
/components
  /ui               # Componentes de shadcn/ui
  GeneratedAd.tsx   # Muestra el anuncio generado
  ProductForm.tsx   # Formulario manual
  UrlInput.tsx      # Input de URL
/lib
  firecrawl.ts     # Cliente de Firecrawl
  gemini.ts        # Cliente de Gemini AI
  types.ts         # Tipos TypeScript
```

## Flujo de la Aplicación

1. **Extracción de Datos**:
   - Con URL: Firecrawl → Datos estructurados
   - Manual: Formulario → Datos estructurados

2. **Generación de Prompt**:
   - Datos → Gemini 2.5 Flash → Prompt JSON estructurado

3. **Generación de Imagen**:
   - Prompt + Logo → Gemini Image Preview → Imagen del anuncio

## Desarrollo

```bash
# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start

# Verificar tipos
npm run type-check

# Ejecutar linter
npm run lint
```

## Demo

Esta es una aplicación demo para la hackathon de Google. No requiere autenticación de usuarios y está optimizada para demostrar las capacidades de generación de imágenes con Gemini AI.

## Licencia

MIT