import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { store } from './store';
import App from './App';
import './index.css';

/**
 * Entry point: mounts the React app, wires Redux provider and React Router.
 */
// Use HashRouter when opened from file:// to ensure routes match and the app renders.
// Otherwise use BrowserRouter with a basename derived from Vite's BASE_URL (for subpath deploys like GitHub Pages).
const isFileProtocol = typeof window !== 'undefined' && window.location.protocol === 'file:';
const Router = isFileProtocol ? HashRouter : BrowserRouter;
// When not using file://, derive basename from Vite at build-time.
const baseName = isFileProtocol ? undefined : import.meta.env.BASE_URL;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
  <Router basename={baseName}>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
