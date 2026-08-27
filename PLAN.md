# Plan de Desarrollo: Aplicación Web Pomodoro

## 1. Estructura de Archivos

```
pomodoro_modo_plan/
├── PLAN.md
├── index.html
├── css/
│   └── style.css
└── js/
    └── app.js
```

> No se utilizan archivos de audio externos. El sonido se genera con Web Audio API.

---

## 2. Requisitos Funcionales

- Dos modos: Work (25 min) y Short Break (5 min)
- Botones: Iniciar/Pausar, Reiniciar, Saltar fase
- Ciclo: Work → Short Break → Work → Short Break (alternancia simple)
- Contador de pomodoros completados (solo en memoria durante la sesión)
- Notificación visual (cambio de color/fondo, animación) y sonora (Web Audio API) al finalizar una fase
- Sin persistencia: el estado se reinicia al recargar la página

## 3. Requisitos No Funcionales

- Accesibilidad: ARIA labels, contraste WCAG AA, navegación por teclado
- Responsive: diseño mobile-first, adaptable a desktop
- Sin dependencias externas, solo HTML5, CSS3 y JavaScript Vanilla

---

## Etapas de Desarrollo

### Etapa 1: Estructura HTML semántica

**Objetivo:** Crear la base HTML con todos los elementos necesarios.

**Elementos a incluir:**

- `<head>`:
  - `<meta charset="UTF-8">`
  - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  - `<title>` descriptivo (ej: "Pomodoro Timer")
  - Enlace a `css/style.css`
- `<body>`:
  - `<header>` con título de la aplicación
  - `<main>` contenedor principal
    - Selector de modo (Work / Short Break) — `<fieldset>` con `<input type="radio">` y `<label>`
    - Display del temporizador (`<div role="timer">`) con formato `MM:SS`
    - Contador de pomodoros completados
    - Grupo de botones: Iniciar/Pausar, Reiniciar, Saltar fase
  - `<footer>` con créditos
- Script defer a `js/app.js` al final del `<body>`

**Criterio de validación:** Validar con HTML Validator (validator.w3.org). Estructura semántica correcta.

---

### Etapa 2: CSS — Reset, variables y layout base

**Objetivo:** Estilos fundamentales y sistema de diseño.

**Contenido:**

- CSS Reset mínimo (box-sizing, margin/padding reset)
- Variables CSS (`:root`):
  - Colores primarios (Work: rojo/coral, Short Break: verde)
  - Color de fondo general
  - Tipografía (fuente monoespaciada para el timer)
  - Transiciones
- Layout con Flexbox centrado (vertical y horizontal)
- Responsive: `font-size` del timer adaptable con `clamp()` o media queries

**Criterio de validación:** Página centrada, colores base visibles, responsive en móvil y desktop.

---

### Etapa 3: CSS — Componentes visuales

**Objetivo:** Estilizar todos los componentes interactivos.

**Contenido:**

- Estilo del selector de modos (tabs o radio buttons estilizados)
- Display del temporizador (tamaño grande, contraste alto)
- Botones con estados: normal, hover, focus, active
- Indicador visual del pomodoro actual (dots o barra de progreso)
- Transición de color de fondo al cambiar de modo
- Estilos de accesibilidad: focus visible, contraste suficiente

**Criterio de validación:** Todos los componentes visibles, interactivos y con estados claros.

---

### Etapa 4: JavaScript — Estado y configuración

**Objetivo:** Definir la estructura de datos y configuración.

**Módulo de configuración:**

```javascript
const CONFIG = {
  workDuration: 25 * 60,      // segundos
  shortBreakDuration: 5 * 60
};
```

**Estado de la aplicación (solo en memoria):**

```javascript
const state = {
  mode: 'work',            // 'work' | 'shortBreak'
  timeRemaining: 25 * 60,
  isRunning: false,
  pomodorosCompleted: 0,
  intervalId: null
};
```

**Funciones a implementar:**

- `init()` — inicializar estado con valores por defecto y renderizar UI

**Criterio de validación:** Consola del navegador muestra estado inicial correcto.

---

### Etapa 5: JavaScript — Lógica del temporizador

**Objetivo:** Implementar la cuenta regresiva con `setInterval`.

**Funciones:**

- `startTimer()` — inicia `setInterval` de 1 segundo
- `pauseTimer()` — detiene el intervalo con `clearInterval`
- `resetTimer()` — resetea al tiempo del modo actual y detiene el intervalo
- `tick()` — decrementa `timeRemaining`, actualiza display, verifica si llegó a 0
- `formatTime(seconds)` — convierte segundos a `MM:SS`
- `updateDisplay()` — renderiza el tiempo en el DOM

**Criterio de validación:** Temporizador cuenta regresiva correctamente, formato MM:SS se muestra bien.

---

### Etapa 6: JavaScript — Eventos de botones y selector de modo

**Objetivo:** Conectar interfaz con lógica.

**Eventos:**

- Click en botón Iniciar/Pausar → alterna `startTimer()` / `pauseTimer()`
- Click en Reiniciar → llama `resetTimer()`
- Click en Saltar fase → alterna al另一个 modo
- Cambio en radio buttons del modo → cambia `state.mode`, resetea temporizador

**Flujo de cambio de modo:**

```
Work → Short Break → Work → Short Break → ...
```

**Criterio de validación:** Botones responden correctamente, cambio entre modos funciona.

---

### Etapa 7: JavaScript — Lógica de ciclos y contador

**Objetivo:** Gestionar la alternancia entre modos y el contador.

**Funciones:**

- `handlePhaseComplete()` — llamada cuando el temporizador llega a 0
  - Si era Work: incrementa `pomodorosCompleted`, cambia a Short Break
  - Si era Short Break: cambia a Work
  - Auto-inicia la siguiente fase
- `nextPhase()` — alterna al modo opuesto
- `updatePomodoroCounter()` — actualiza los dots/indicadores en el DOM

**Criterio de validación:** Completar Work activa Short Break automáticamente. El contador se incrementa.

---

### Etapa 8: JavaScript — Notificaciones

**Objetivo:** Alertar al usuario cuando termina una fase.

**Notificación visual:**

- Cambio automático de color de fondo (se activa con clase en `<body>`)
- Animación o parpadeo en el display del timer
- Cambio de título de la pestaña (`document.title`) mostrando el estado

**Notificación sonora (Web Audio API):**

- Crear `AudioContext` y generar tono con `OscillatorNode`
- Función `playAlarm()` que emita un patrón de tonos (ej: 3 beeps cortos)
- El audio se crea por programación, sin archivos externos
- Manejar restricciones de autoplay: iniciar `AudioContext` en el primer click del usuario

**Criterio de validación:** Al llegar a 0 se escucha alarma generada por Web Audio API, cambia color, se actualiza título.

---

### Etapa 9: Accesibilidad

**Objetivo:** Cumplir estándares básicos de accesibilidad (WCAG 2.1 AA).

**Implementaciones:**

- `aria-label` en todos los botones descriptivos
- `role="timer"` y `aria-live="polite"` en el display del temporizador
- `aria-pressed` en botón de iniciar/pausar
- Navegación completa por teclado (Tab, Enter, Espacio)
- Focus visible en todos los elementos interactivos
- Contraste de colores ≥ 4.5:1 para texto
- `prefers-reduced-motion`: desactivar animaciones si el usuario lo solicita

**Criterio de validación:** Navegar solo con teclado funciona. Auditoría Lighthouse ≥ 90 en accesibilidad.

---

### Etapa 10: Responsive Design

**Objetivo:** Experiencia óptima en todos los tamaños de pantalla.

**Breakpoints:**

- Mobile: < 480px (estilo base, mobile-first)
- Tablet: 480px – 768px
- Desktop: > 768px

**Ajustes:**

- Timer: tamaño de fuente con `clamp(3rem, 10vw, 8rem)`
- Botones: tamaño táctil mínimo 44x44px
- Layout: Flexbox column en mobile, centrado en desktop
- Selector de modo: pills en mobile, tabs en desktop
- Padding y márgenes adaptables

**Criterio de validación:** Funciona bien en Chrome DevTools (iPhone, iPad, Desktop). Sin scroll horizontal.

---

### Etapa 11: Pulido y pruebas finales

**Objetivo:** Refinar la experiencia y verificar todo.

**Checklist:**

- [ ] Temporizador preciso con setInterval
- [ ] Transiciones de color suaves entre modos
- [ ] Botones con feedback visual claro
- [ ] Web Audio API genera alarma correctamente
- [ ] Contador de pomodoros se incrementa y muestra
- [ ] Accesibilidad: teclado, ARIA, contraste
- [ ] Responsive: móvil, tablet, desktop
- [ ] Sin errores en consola del navegador
- [ ] Código limpio y organizado
- [ ] Validar HTML y CSS

---

## Resumen de Archivos Finales

| Archivo | Responsabilidad |
|---------|----------------|
| `index.html` | Estructura semántica, meta tags, enlaces |
| `css/style.css` | Todo el estilo: reset, variables, componentes, responsive |
| `js/app.js` | Toda la lógica: estado, temporizador, eventos, notificaciones |

## Convenciones de Código

- **HTML:** indentación con 2 espacios, atributos en líneas separadas si son muchos
- **CSS:** BEM-like naming (`.timer__display`, `.btn--primary`), variables para colores
- **JS:** funciones puras cuando sea posible, naming camelCase, comentarios solo en lógica compleja
- **General:** mantener archivos cortos y modulares dentro de un solo archivo por tipo
