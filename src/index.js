import React from 'react';
import ReactDOM from 'react-dom';

import Root from 'src/containers/Root';
import reportWebVitals from 'src/reportWebVitals';
import { isDev, isMobile } from 'src/utils/common';

window.isMobile = isMobile();
window.isDev = isDev();

ReactDOM.render(
  <Root />,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
