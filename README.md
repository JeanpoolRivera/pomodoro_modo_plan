# Pomodoro Timer

Aplicación web de temporizador Pomodoro desarrollada con HTML5, CSS3 y JavaScript Vanilla, sin frameworks ni librerías externas.

## Descripción

Pomodoro Timer es una herramienta de productividad que implementa la técnica Pomodoro: alternar sesiones de trabajo de 25 minutos con descansos cortos de 5 minutos. La aplicación incluye notificaciones visuales y sonoras, contador de pomodoros completados y diseño responsive.

## Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere instalación de dependencias
- No requiere servidor local (se ejecuta directamente abriendo `index.html`)

## Estructura del Proyecto

```
pomodoro_modo_plan/
├── README.md
├── PLAN.md
├── index.html
├── css/
│   └── style.css
└── js/
    └── app.js
```

## Ejecución

1. Clonar el repositorio
2. Abrir `index.html` en un navegador web
3. No se necesita构建 ni servidor de desarrollo

## Funcionalidades

| Funcionalidad | Descripción |
|---------------|-------------|
| Modo Work | Temporizador de 25 minutos |
| Modo Short Break | Temporizador de 5 minutos |
| Iniciar/Pausar | Alterna el estado del temporizador |
| Reiniciar | Restaura el tiempo del modo actual |
| Saltar fase | Avanza al siguiente modo sin esperar |
| Contador de pomodoros | Muestra completados con indicadores visuales |
| Notificación sonora | 3 beeps generados con Web Audio API |
| Notificación visual | Cambio de color de fondo + animación pulse |
| Título dinámico | `document.title` refleja el modo actual |
| Sin persistencia | Estado se reinicia al recargar (solo en memoria) |

## Accesibilidad

- `aria-label` en botones y contenedor del timer
- `role="timer"` con `aria-live="polite"` para lectores de pantalla
- `aria-pressed` en botón de inicio/pausa
- Navegación completa por teclado (Tab, Enter, Espacio)
- `focus-visible` con outline visible
- `prefers-reduced-motion`: desactiva animaciones
- Contraste de colores WCAG AA

## Diseño Responsive

| Breakpoint | Comportamiento |
|------------|----------------|
| < 480px | Mobile-first: botones compactos, timer con `clamp()` |
| 480px – 768px | Tablet: espaciado intermedio |
| > 768px | Desktop: layout expandido, botones más grandes |

## Metodología Modo Plan

El desarrollo de esta aplicación siguió la metodología **Modo Plan**, un enfoque iterativo donde cada etapa fue planificada, implementada y verificada de forma aislada antes de avanzar a la siguiente.

### Bitácora de Desarrollo

| Etapa | Descripción | Prompt / Instrucción |
|-------|-------------|----------------------|
| **Plan** | Análisis de requisitos y creación de `PLAN.md` con 11 etapas | *"Analiza los requisitos y prepara un plan de desarrollo paso a paso"* |
| **Revisión** | Verificación de requisitos faltantes y correcciones al plan | *"Revisa el PLAN.md y verifica que cubra todos los requisitos"* |
| **Ajuste** | Eliminación de Long Break y localStorage, simplificación a 2 modos | *"Ajusta el plan estrictamente a la consigna original"* |
| **Etapa 1** | Estructura HTML semántica con meta viewport y title | *"Implementa únicamente la Etapa 1"* |
| **Etapa 2** | CSS Reset, variables, layout Flexbox centrado | *"Implementa únicamente la Etapa 2"* |
| **Etapa 3** | Componentes visuales: fieldset, dots, botones, focus | *"Implementa únicamente la Etapa 3"* |
| **Etapa 4** | Estado JavaScript, CONFIG, init(), renderPomodoroCounter | *"Implementa únicamente la Etapa 4"* |
| **Etapa 5** | Lógica del temporizador: start, pause, reset, tick | *"Implementa únicamente la Etapa 5"* |
| **Etapa 6** | Eventos de botones y selector de modo Work/Short Break | *"Implementa únicamente la Etapa 6"* |
| **Etapa 7** | Ciclos: Work completa → incrementa contador → auto-start Short Break | *"Implementa únicamente la Etapa 7"* |
| **Etapa 8** | Notificaciones: Web Audio API (3 beeps), animación pulse, título dinámico | *"Implementa únicamente la Etapa 8"* |
| **Etapa 9** | Accesibilidad: ARIA, prefers-reduced-motion, min-height 44px | *"Implementa únicamente la Etapa 9"* |
| **Etapa 10** | Responsive: breakpoints mobile/tablet/desktop | *"Implementa únicamente la Etapa 10"* |
| **Etapa 11** | Pulido: corrección de orden de notificaciones, async playAlarm, naming | *"Implementa únicamente la Etapa 11"* |

### Principios de Modo Plan Aplicados

1. **Una etapa a la vez**: cada prompt implementaba una sola etapa del plan
2. **Verificación explícita**: al finalizar cada etapa se indicaba qué se creó o modificó
3. **Sin avance prematuro**: se prohibía implementar funcionalidades de etapas posteriores
4. **Plan como contrato**: `PLAN.md` era la fuente de verdad para cada instrucción
5. **Correcciones controladas**: los ajustes al plan se hacían antes de implementar código

## Archivos del Proyecto

| Archivo | Líneas | Responsabilidad |
|---------|--------|-----------------|
| `index.html` | 48 | Estructura semántica, meta tags, ARIA |
| `css/style.css` | 295 | Reset, variables, componentes, responsive, accesibilidad |
| `js/app.js` | 225 | Estado, temporizador, eventos, notificaciones Web Audio |
| `PLAN.md` | 280 | Plan de desarrollo con11 etapas |

## Licencia

Proyecto académico — Práctica de Programación Web 2026
