(function () {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  const isFrench = document.documentElement.lang === 'fr';
  const labels = isFrench
    ? { light: 'Thème sombre', dark: 'Thème clair' }
    : { light: 'Dark Mode', dark: 'Light Mode' };

  function label(theme) {
    return theme === 'dark' ? labels.dark : labels.light;
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    btn.textContent = label(theme);
  }

  const current = document.documentElement.getAttribute('data-theme') || 'light';
  apply(current);

  btn.addEventListener('click', function () {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
  });
})();
