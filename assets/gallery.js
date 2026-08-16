(function () {
  const galleries = document.querySelectorAll('.gallery');
  if (!galleries.length) return;

  const images = [];
  galleries.forEach((gallery) => {
    gallery.querySelectorAll('figure').forEach((fig) => {
      const img = fig.querySelector('img');
      if (img) {
        images.push({
          src: img.getAttribute('src'),
          alt: img.getAttribute('alt') || ''
        });
        const index = images.length - 1;
        img.addEventListener('click', () => openLightbox(index));
      }
    });
  });

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Fermer">&times;</button>
    <div class="lightbox-content">
      <div class="lightbox-nav">
        <button class="lightbox-btn lightbox-prev" aria-label="Image précédente">&#8592;</button>
        <img src="" alt="">
        <button class="lightbox-btn lightbox-next" aria-label="Image suivante">&#8594;</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('img');
  let current = 0;

  function render() {
    const item = images[current];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
  }

  function openLightbox(index) {
    current = index;
    render();
    overlay.classList.add('open');
  }

  function close() {
    overlay.classList.remove('open');
  }

  function prev() {
    current = (current - 1 + images.length) % images.length;
    render();
  }

  function next() {
    current = (current + 1) % images.length;
    render();
  }

  overlay.querySelector('.lightbox-close').addEventListener('click', close);
  overlay.querySelector('.lightbox-prev').addEventListener('click', prev);
  overlay.querySelector('.lightbox-next').addEventListener('click', next);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
})();
