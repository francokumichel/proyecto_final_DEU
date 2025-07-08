document.addEventListener('DOMContentLoaded', () => {
  const root = document.body;
  let styleElement = null;

  document.getElementById('darkModeToggle')?.addEventListener('change', e => {
    document.body.classList.toggle('dark-mode', e.target.checked);

    const isDarkMode = e.target.checked;
    if (styleElement) {
      styleElement.remove();
      styleElement = null;
    }
    // Si está en dark mode, inyectamos el CSS
    if (isDarkMode) {
      styleElement = document.createElement('style');
      styleElement.textContent = `
        :root {
          --map-tiles-filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
        }

        @media (prefers-color-scheme: dark) {
          .map-tiles {
            filter: var(--map-tiles-filter, none);
          }
        }

        .bi i {
          font-size: 32px;
          color: white;
        }
      `;
      document.head.appendChild(styleElement);
    }
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
