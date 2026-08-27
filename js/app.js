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

/* --- Web Audio API --- */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

async function playAlarm() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  const beeps = [0, 0.2, 0.4];
  const DURATION = 0.12;
  const FREQUENCY = 880;

  beeps.forEach(offset => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = FREQUENCY;
    gain.gain.setValueAtTime(0.3, ctx.currentTime + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + DURATION);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + offset);
    osc.stop(ctx.currentTime + offset + DURATION);
  });
}

/* --- Notificación visual --- */

function notifyPhaseComplete(nextModeName) {
  document.title = `${nextModeName} — Pomodoro Timer`;
  setTimeout(() => {
    timerDisplay.classList.add('timer-alert');
    setTimeout(() => {
      timerDisplay.classList.remove('timer-alert');
    }, 1500);
  }, 200);
}

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
    handlePhaseComplete();
  }
}

/* --- Cambio de modo --- */

function applyModeStyles() {
  document.body.classList.toggle('short-break', state.mode === 'shortBreak');
}

function setMode(mode) {
  state.mode = mode;
  const checkedValue = mode === 'work' ? 'work' : 'shortBreak';
  const modeName = mode === 'work' ? 'Work' : 'Short Break';
  modeRadios.forEach(radio => {
    radio.checked = radio.value === checkedValue;
  });
  document.title = `${modeName} — Pomodoro Timer`;
  applyModeStyles();
}

function nextPhase() {
  pauseTimer();
  setMode(state.mode === 'work' ? 'shortBreak' : 'work');
  state.timeRemaining = getDurationForMode(state.mode);
  updateDisplay();
}

function handlePhaseComplete() {
  if (state.mode === 'work') {
    state.pomodorosCompleted++;
    renderPomodoroCounter();
  }

  const nextMode = state.mode === 'work' ? 'shortBreak' : 'work';
  const nextModeName = nextMode === 'work' ? 'Work' : 'Short Break';

  setMode(nextMode);
  state.timeRemaining = getDurationForMode(state.mode);
  updateDisplay();

  playAlarm();
  notifyPhaseComplete(nextModeName);

  startTimer();
  btnStart.textContent = 'Pausar';
  btnStart.setAttribute('aria-pressed', 'true');
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
