import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'normalize.css';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import theme from './themes';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from "react-router-dom";
const store = createStore(rootReducer);

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </Router >,
  document.getElementById('root')
);