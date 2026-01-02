import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ColorModeProvider from './contexts/ColorModeContext.jsx';

const registerCopyPrevention = () => {
  document.addEventListener('contextmenu', (event) => event.preventDefault());

  const blockDefaultAction = (event) => event.preventDefault();
  document.addEventListener('selectstart', blockDefaultAction);
  document.addEventListener('dragstart', blockDefaultAction);

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && ['c', 'x', 's', 'p'].includes(event.key.toLowerCase())) {
      event.preventDefault();
    }
  });
};

const registerScreenshotPrevention = () => {
  const overlay = document.getElementById('privacy-overlay');
  if (!overlay) return;

  const showOverlay = () => {
    overlay.style.display = 'flex';
  };

  const hideOverlay = () => {
    overlay.style.display = 'none';
  };

  document.addEventListener('keydown', async (event) => {
    if (event.key === 'PrintScreen') {
      showOverlay();
      try {
        await navigator.clipboard.writeText('Screenshots are blocked on this site.');
      } catch (error) {
        // Swallow clipboard errors (e.g., permissions) while keeping the overlay visible briefly.
      }
      setTimeout(hideOverlay, 1800);
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      showOverlay();
    } else {
      hideOverlay();
    }
  });
};

const hideSplashScreen = () => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.remove();
    }, 2000);
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorModeProvider>
      <App />
    </ColorModeProvider>
  </React.StrictMode>
);

registerCopyPrevention();
registerScreenshotPrevention();
hideSplashScreen();

