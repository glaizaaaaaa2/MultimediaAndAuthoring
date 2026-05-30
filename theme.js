
// Shared theme logic — dark (pink/black) & light (amber/navy)
(function(){
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  window.toggleTheme = function(){
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleUI();
  };

  function updateToggleUI(){
    const btn = document.getElementById('theme-toggle');
    if(!btn) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.querySelector('.toggle-icon').textContent = isDark ? '☀' : '☾';
    btn.querySelector('.toggle-label').textContent = isDark ? 'Light' : 'Dark';
  }

  window.addEventListener('DOMContentLoaded', updateToggleUI);
})();
