(function () {
  const audio = document.getElementById('site-audio');
  const btn = document.querySelector('.music-toggle');
  if (!audio || !btn) return;

  const isFrench = document.documentElement.lang === 'fr';
  const label = isFrench ? 'Musique' : 'Music';
  const labelEl = btn.querySelector('.music-label');
  if (labelEl) labelEl.textContent = label;

  function setLabel(playing) {
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
  }

  // Restaure la position d'écoute d'une page à l'autre.
  const savedTime = parseFloat(localStorage.getItem('musicTime') || '0');
  if (!isNaN(savedTime) && savedTime > 0) {
    audio.currentTime = savedTime;
  }

  const wasPlaying = localStorage.getItem('musicPlaying') === 'true';
  setLabel(wasPlaying);

  if (wasPlaying) {
    // Les navigateurs peuvent bloquer la reprise automatique du son
    // tant qu'il n'y a pas eu d'interaction sur la page en cours ;
    // dans ce cas, le bouton reste simplement prêt à être cliqué.
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        setLabel(false);
      });
    }
  }

  btn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play();
      localStorage.setItem('musicPlaying', 'true');
      setLabel(true);
    } else {
      audio.pause();
      localStorage.setItem('musicPlaying', 'false');
      setLabel(false);
    }
  });

  audio.addEventListener('timeupdate', function () {
    localStorage.setItem('musicTime', String(audio.currentTime));
  });

  window.addEventListener('beforeunload', function () {
    localStorage.setItem('musicTime', String(audio.currentTime));
  });
})();
