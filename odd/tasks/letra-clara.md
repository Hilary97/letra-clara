# Letra Clara — lecturas para chicos con TDAH y dislexia

Sitio estático (Vite + React + TS) con cuentos cortos y ayudas de lectura adaptables.
Objetivo: leer sin apuro, sin ruido visual y sin castigo por error.

## Specs

- **S1** — «quiero hacer una pagina web para lecturas a niños con tdah y dislexia». La página ofrece lecturas cortas en español y, para cada cuento, un lector que se adapta a las dos condiciones: tipografía amplia y espaciada, líneas cortas, sin texto justificado, sin fondos blancos puros, sin animaciones que distraigan, sin límite de tiempo ni puntaje.
- **S2** — «crea un repo en git». El proyecto queda en un repositorio git propio, con commits de unidades revisables, publicado en GitHub.
- **S3** — «desplegas en vercel». El sitio queda desplegado y accesible por una URL pública de Vercel.

### Interpretación de S1 (alcance funcional)

- **S1.1** Biblioteca de cuentos: nivel (inicial / intermedio), duración estimada, tema.
- **S1.2** Lector con ajustes persistentes: tema de color (crema, claro, verde suave, oscuro), familia tipográfica (Atkinson Hyperlegible / sistema), tamaño (18–32 px), interlínea (1,5–2,4), espaciado entre letras (0–0,14 em).
- **S1.3** Ayudas de atención: regla de lectura que sigue el puntero, modo enfoque (oculta todo el chrome), negrita progresiva opcional por palabra, barra de progreso de lectura y temporizador de sesión con pausa activa cada 5/10/15 minutos.
- **S1.4** Lectura en voz alta con la voz del sistema (Web Speech API) en español, con resaltado de párrafo y palabra, y velocidad regulable.
- **S1.5** Preguntas de comprensión con respuesta amable: sin rojo de error, sin puntaje, con reintento y pista.
- **S1.6** Accesibilidad: navegación por teclado, foco visible, objetivos táctiles ≥ 44 px, `prefers-reduced-motion`, contraste AA, sin dependencia de color únicamente.
- **S1.7** Sin backend: preferencias y cuentos leídos quedan en `localStorage`.
- **S2.1** Sin secretos en el repo; `.gitignore` cubre `node_modules`, `dist`, artefactos de Vercel.
- **S3.1** Build estático (`npm run build` → `dist`), deploy de producción en Vercel.

## Tasks

| ID | Specs | Ruta | Commit |
| --- | --- | --- | --- |
| T1 | S1, S1.1–S1.7 | Scaffold Vite + React + TS, tokens de diseño y cuentos | `c8862a2` |
| T2 | S1.1, S1.2, S1.7 | Lógica pura (tipografía progresiva, preferencias, leídos) + tests | `95afd07` |
| T3 | S1.1, S1.6 | Biblioteca: hero, filtros por nivel, tarjetas, sección de ayudas | `23cc022` |
| T4 | S1.2–S1.6 | Lector: ajustes, regla, enfoque, voz, temporizador, pausa activa, preguntas | `23cc022` |
| T5 | S1.6, S3.1 | Verificación: typecheck, tests, build, smoke con preview | `23cc022` |
| T6 | S2, S2.1 | Repo git + publicación en GitHub | https://github.com/Hilary97/letra-clara |
| T7 | S3, S3.1 | Deploy de producción en Vercel | https://letra-clara.vercel.app |

## Log

- **L1** — «quiero hacer una pagina web para lecturas a niños con tdah y dislexia crea un repo en git y desplegas en vercel»
- **L2** — Sin pedido explícito de contenido: se incluyen 6 cuentos originales cortos (2–4 min) con preguntas de comprensión, porque sin textos la lectura no se puede probar.
- **L3** — Stack elegido: Vite + React 19 + TypeScript, CSS propio con tokens (sin dependencias de UI). Deploy estático: Vercel detecta Vite y sirve `dist`.
- **L4** — Verificación observada: `npm test` 27/27, `npm run build` OK (17,8 kB CSS / 252,7 kB JS sin minificar), y smoke de navegador 22/22 en desktop (1440×900) y móvil (390×844): biblioteca, filtros, lector, A+, regla, temas, persistencia tras recarga, preguntas, modo enfoque, badge de leído, sin overflow horizontal y sin errores de consola. El mismo smoke se repitió contra la URL de producción con 22/22.
- **L5** — Corrección tras revisar capturas: en móvil la barra fija más la barra de herramientas ocupaban ~340 px (40% de la pantalla); se compactó a 61 px de barra y una tira de herramientas desplazable, y el texto empieza a 133 px.
