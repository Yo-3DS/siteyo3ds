(function () {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  function label(theme) {
    return theme === 'dark' ? 'Mode clair' : 'Mode sombre';
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
