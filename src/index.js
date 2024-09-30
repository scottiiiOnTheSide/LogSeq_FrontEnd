
import React from 'react';
import ReactDOM from 'react-dom/client';

import { UIContextProvider } from './UIcontext';
import { BrowserRouter as Router } from "react-router-dom";

import Main from "./Main";
import './Main.css';

const body = document.getElementsByTagName('body')[0]
const root = ReactDOM.createRoot(body);
root.render(
  <React.StrictMode>

    {/*<Router> 
      <UIContextProvider>
        <Main />
      </UIContextProvider> 
    </Router>*/}
    <Main />

  </React.StrictMode>
);