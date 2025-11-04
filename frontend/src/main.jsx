import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ColorModeProvider from './contexts/ColorModeContext.jsx';

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

hideSplashScreen();
