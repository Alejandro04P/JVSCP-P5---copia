// Selección de elementos
const video = document.getElementById('video');
const playPauseBtn = document.getElementById('playPause');
const muteBtn = document.getElementById('mute');
const progressBar = document.getElementById('progress-bar');
const volumeControl = document.getElementById('volumen');

// Alternar reproducción/pausa
playPauseBtn.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        playPauseBtn.textContent = '⏸'; // Cambia el botón a pausa
    } else {
        video.pause();
        playPauseBtn.textContent = '▶'; // Cambia el botón a reproducir
    }
});

// Silenciar/activar sonido
muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? '🔇' : '🔊'; // Cambia el icono
});

// Actualizar barra de progreso
video.addEventListener('timeupdate', () => {
    const progress = (video.currentTime / video.duration) * 100;
    progressBar.value = progress;
});

// Cambiar tiempo del video desde la barra de progreso
progressBar.addEventListener('input', () => {
    const time = (progressBar.value / 100) * video.duration;
    video.currentTime = time;
});

