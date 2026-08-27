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

/* --- Utilidades --- */

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(state.timeRemaining);
}

/* --- Inicialización --- */

function init() {
  state.timeRemaining = CONFIG.workDuration;
  state.mode = 'work';
  state.isRunning = false;
  state.pomodorosCompleted = 0;
  state.intervalId = null;

  updateDisplay();
  renderPomodoroCounter();
}

function renderPomodoroCounter() {
  dots.forEach((dot, i) => {
    dot.classList.toggle('filled', i < state.pomodorosCompleted);
  });
}

document.addEventListener('DOMContentLoaded', init);
