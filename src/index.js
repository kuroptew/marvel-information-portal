import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';
import './style/style.scss';
import {BrowserRouter, HashRouter} from "react-router-dom";

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <HashRouter>
      <App/>
    </HashRouter>
  )


