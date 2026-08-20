(function () {
  const toggle = document.querySelector('.nav-toggle');
  const collapse = document.getElementById('nav-collapse');
  if (!toggle || !collapse) return;

  function closeMenu() {
    collapse.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    collapse.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', function () {
    const isOpen = collapse.classList.contains('open');
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });

  collapse.addEventListener('click', function (e) {
    if (e.target.closest('a')) { closeMenu(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); }
  });

  document.addEventListener('click', function (e) {
    if (!collapse.classList.contains('open')) return;
    if (collapse.contains(e.target) || toggle.contains(e.target)) return;
    closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) { closeMenu(); }
  });
})();
