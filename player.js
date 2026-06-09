document.addEventListener('DOMContentLoaded', () => {
  const playSVG  = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>`;
  const pauseSVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
  const unmuteSVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
  const muteSVG  = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19L19 20.27 20.27 19 5.27 4 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;

  function formatTime(s) {
    if (isNaN(s) || s === Infinity) return '0:00';
    const m = Math.floor(s / 60);
    const sec = String(Math.floor(s % 60)).padStart(2, '0');
    return `${m}:${sec}`;
  }

  document.querySelectorAll('.audio-player').forEach(player => {
    const audio    = player.querySelector('.ap-audio');
    const playBtn  = player.querySelector('.ap-play');
    const muteBtn  = player.querySelector('.ap-mute');
    const bar      = player.querySelector('.ap-bar');
    const fill     = player.querySelector('.ap-fill');
    const current  = player.querySelector('.ap-current');
    const duration = player.querySelector('.ap-duration');

    // set initial icons
    playBtn.innerHTML = playSVG;
    muteBtn.innerHTML = unmuteSVG;

    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        // pause any other playing audio on the page
        document.querySelectorAll('.ap-audio').forEach(a => {
          if (a !== audio) {
            a.pause();
            a.closest('.audio-player').querySelector('.ap-play').innerHTML = playSVG;
          }
        });
        audio.play();
        playBtn.innerHTML = pauseSVG;
        playBtn.setAttribute('aria-label', 'Pause');
      } else {
        audio.pause();
        playBtn.innerHTML = playSVG;
        playBtn.setAttribute('aria-label', 'Play');
      }
    });

    muteBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      muteBtn.innerHTML = audio.muted ? muteSVG : unmuteSVG;
      muteBtn.setAttribute('aria-label', audio.muted ? 'Unmute' : 'Mute');
    });

    bar.addEventListener('click', e => {
      if (!audio.duration) return;
      const rect = bar.getBoundingClientRect();
      audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
      current.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      duration.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
      playBtn.innerHTML = playSVG;
      playBtn.setAttribute('aria-label', 'Play');
      fill.style.width = '0%';
      current.textContent = '0:00';
    });
  });
});
