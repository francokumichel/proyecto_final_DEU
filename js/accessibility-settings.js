document.addEventListener('DOMContentLoaded', () => {
  const root = document.body;

  // Contraste alto
  document.getElementById('highContrast')?.addEventListener('change', e => {
    root.classList.toggle('high-contrast', e.target.checked);
  });

  // Tamaño de fuente
  document.getElementById('fontSizeSelect')?.addEventListener('change', e => {
    const html = document.documentElement;
    html.classList.remove('font-normal', 'font-large', 'font-xlarge');
    html.classList.add(`font-${e.target.value}`);
  });


  // Tipografía legible
  document.getElementById('dyslexicFont')?.addEventListener('change', e => {
    root.classList.toggle('dyslexic-font', e.target.checked);
  });

  // Resaltar foco del teclado
  document.getElementById('highlightFocus')?.addEventListener('change', e => {
    root.classList.toggle('focus-visible', e.target.checked);
  });
});
