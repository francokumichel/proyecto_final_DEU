document.addEventListener('DOMContentLoaded', () => {
  const root = document.body;
  let styleElement = null;

  const darkModeToggle = document.getElementById('darkModeToggle');
  const fontSizeSelect = document.getElementById('fontSizeSelect');
  const dyslexicFont = document.getElementById('dyslexicFont');
  const highlightFocus = document.getElementById('highlightFocus');

  // Función para aplicar dark mode y su estilo extra
  const applyDarkMode = (enabled) => {
    document.body.classList.toggle('dark-mode', enabled);

    if (styleElement) {
      styleElement.remove();
      styleElement = null;
    }

    if (enabled) {
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
  };

  // Cargar configuraciones desde localStorage
  const savedSettings = {
    darkMode: JSON.parse(localStorage.getItem('accessibility-darkMode') || 'false'),
    fontSize: localStorage.getItem('accessibility-fontSize') || 'normal',
    dyslexicFont: JSON.parse(localStorage.getItem('accessibility-dyslexicFont') || 'false'),
    highlightFocus: JSON.parse(localStorage.getItem('accessibility-highlightFocus') || 'false')
  };

  // Aplicar configuraciones guardadas
  applyDarkMode(savedSettings.darkMode);
  darkModeToggle.checked = savedSettings.darkMode;

  document.documentElement.classList.add(`font-${savedSettings.fontSize}`);
  fontSizeSelect.value = savedSettings.fontSize;

  root.classList.toggle('dyslexic-font', savedSettings.dyslexicFont);
  dyslexicFont.checked = savedSettings.dyslexicFont;

  root.classList.toggle('focus-visible', savedSettings.highlightFocus);
  highlightFocus.checked = savedSettings.highlightFocus;

  // Event Listeners que guardan cambios
  darkModeToggle?.addEventListener('change', e => {
    const enabled = e.target.checked;
    applyDarkMode(enabled);
    localStorage.setItem('accessibility-darkMode', JSON.stringify(enabled));
  });

  fontSizeSelect?.addEventListener('change', e => {
    const html = document.documentElement;
    html.classList.remove('font-normal', 'font-large', 'font-xlarge');
    const value = e.target.value;
    html.classList.add(`font-${value}`);
    localStorage.setItem('accessibility-fontSize', value);
  });

  dyslexicFont?.addEventListener('change', e => {
    root.classList.toggle('dyslexic-font', e.target.checked);
    localStorage.setItem('accessibility-dyslexicFont', JSON.stringify(e.target.checked));
  });

  highlightFocus?.addEventListener('change', e => {
    root.classList.toggle('focus-visible', e.target.checked);
    localStorage.setItem('accessibility-highlightFocus', JSON.stringify(e.target.checked));
  });
});
