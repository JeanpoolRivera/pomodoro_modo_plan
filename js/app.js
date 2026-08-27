/* ========================================
   Etapa 4 — Estado y configuración
   ======================================== */

const CONFIG = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60
};

const state = {
  mode: 'work',
  timeRemaining: CONFIG.workDuration,
  isRunning: false,
  pomodorosCompleted: 0,
  intervalId: null
};

/* --- Referencias DOM --- */

const timerDisplay = document.querySelector('[role="timer"]');
const btnStart = document.getElementById('btn-start');
const btnReset = document.getElementById('btn-reset');
const btnSkip = document.getElementById('btn-skip');
const dots = document.querySelectorAll('.dot');
const modeRadios = document.querySelectorAll('input[name="mode"]');

/* --- Utilidades --- */

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getDurationForMode(mode) {
  return mode === 'work' ? CONFIG.workDuration : CONFIG.shortBreakDuration;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(state.timeRemaining);
}

/* --- Lógica del temporizador --- */

function startTimer() {
  if (state.isRunning) return;
  state.isRunning = true;
  state.intervalId = setInterval(tick, 1000);
}

function pauseTimer() {
  if (!state.isRunning) return;
  clearInterval(state.intervalId);
  state.intervalId = null;
  state.isRunning = false;
}

function resetTimer() {
  pauseTimer();
  state.timeRemaining = getDurationForMode(state.mode);
  updateDisplay();
}

function tick() {
  state.timeRemaining--;
  updateDisplay();

  if (state.timeRemaining <= 0) {
    pauseTimer();
  }
}

/* --- Cambio de modo --- */

function applyModeStyles() {
  document.body.classList.toggle('short-break', state.mode === 'shortBreak');
}

function setMode(mode) {
  state.mode = mode;
  const checkedValue = mode === 'work' ? 'work' : 'shortBreak';
  modeRadios.forEach(radio => {
    radio.checked = radio.value === checkedValue;
  });
  applyModeStyles();
}

function nextPhase() {
  pauseTimer();
  setMode(state.mode === 'work' ? 'shortBreak' : 'work');
  state.timeRemaining = getDurationForMode(state.mode);
  updateDisplay();
}

/* --- Eventos --- */

function handleStartPause() {
  if (state.isRunning) {
    pauseTimer();
    btnStart.textContent = 'Iniciar';
    btnStart.setAttribute('aria-pressed', 'false');
  } else {
    startTimer();
    btnStart.textContent = 'Pausar';
    btnStart.setAttribute('aria-pressed', 'true');
  }
}

function handleReset() {
  resetTimer();
  btnStart.textContent = 'Iniciar';
  btnStart.setAttribute('aria-pressed', 'false');
}

function handleSkip() {
  nextPhase();
  btnStart.textContent = 'Iniciar';
  btnStart.setAttribute('aria-pressed', 'false');
}

function handleModeChange(e) {
  setMode(e.target.value);
  resetTimer();
  btnStart.textContent = 'Iniciar';
  btnStart.setAttribute('aria-pressed', 'false');
}

/* --- Inicialización --- */

function init() {
  state.timeRemaining = getDurationForMode(state.mode);
  state.isRunning = false;
  state.pomodorosCompleted = 0;
  state.intervalId = null;

  applyModeStyles();
  updateDisplay();
  renderPomodoroCounter();

  btnStart.addEventListener('click', handleStartPause);
  btnReset.addEventListener('click', handleReset);
  btnSkip.addEventListener('click', handleSkip);
  modeRadios.forEach(radio => {
    radio.addEventListener('change', handleModeChange);
  });
}

function renderPomodoroCounter() {
  dots.forEach((dot, i) => {
    dot.classList.toggle('filled', i < state.pomodorosCompleted);
  });
}

document.addEventListener('DOMContentLoaded', init);
