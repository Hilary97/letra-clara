# Letra Clara

Cuentos cortos para chicos con **TDAH** y **dislexia**, pensados para leer sin apuro, sin
ruido visual y sin castigo por error.

Sitio 100% estático: React + TypeScript + Vite, sin backend y sin cuentas. Las preferencias
y los cuentos leídos quedan en `localStorage`, en el dispositivo.

## Qué incluye

- **Biblioteca** de 6 cuentos originales en español (nivel inicial y un poco más), con
  duración estimada, edad sugerida y preguntas de comprensión.
- **Lector adaptable**: color de fondo (crema, claro, verde suave, noche), familia
  tipográfica (Atkinson Hyperlegible o Verdana), tamaño 18–32 px, interlínea 1,5–2,4 y
  espaciado entre letras 0–0,14 em.
- **Ayudas de atención**: regla de lectura que sigue el puntero, modo enfoque, negrita
  progresiva opcional, barra de progreso y temporizador con pausa activa de respiración
  cada 5, 10 o 15 minutos.
- **Lectura en voz alta** con la voz del sistema (Web Speech API) en español, con
  resaltado del párrafo y de la palabra que se está leyendo y velocidad regulable.
- **Preguntas amables**: sin puntaje, sin rojo de error, con reintento y pista de dónde
  está la respuesta.

## Decisiones de accesibilidad

- Texto alineado a la izquierda (nunca justificado), líneas de 62 caracteres, sin guiones
  automáticos y con `text-wrap: pretty`.
- Ningún fondo blanco puro en el papel de lectura por defecto; contraste AA en los cuatro
  temas.
- El error se marca en ámbar con borde punteado y una pista; el acierto usa verde **y** un
  tilde, nunca solo color.
- Objetivos táctiles de 44 px, foco visible, `Escape` sale del modo enfoque, enlaces de
  salto y `prefers-reduced-motion` respetado.
- Los cuentos usan oraciones de hasta 20 palabras y párrafos de hasta 3 oraciones (hay un
  test que lo verifica).

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # tests de la lógica pura (vitest)
npm run typecheck
npm run build      # dist/ estático
npm run preview
```

## Agregar un cuento

Editá `src/data/stories.ts`: cada cuento es un objeto con `id`, `title`, `emoji`, `level`
(`inicial` | `intermedio`), `minutes`, `ages`, `summary`, `tint`, `paragraphs` y `questions`
(cada pregunta con `correctIndex`, `praise` y `retry`). Los tests de `stories.test.ts`
validan que el contenido siga siendo corto y respondible.

## Deploy

Vercel detecta Vite automáticamente (`npm run build` → `dist`).

```bash
vercel --prod
```

## Estructura

```
src/
  components/   Library, Reader, AidsPanel, StoryText, Questions, PauseOverlay
  data/         stories.ts (contenido) + tests de integridad
  hooks/        useSpeech.ts (Web Speech API)
  lib/          bionic.ts, preferences.ts, read-state.ts + tests
  styles.css    tokens de color, temas y estilos
```

Contenido y código bajo uso educativo. Los cuentos son originales.
