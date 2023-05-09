import 'regenerator-runtime';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import './styles.scss';

const Shell = () => {
  return <App />;
};

window.onload = () => {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(<Shell />);
};
