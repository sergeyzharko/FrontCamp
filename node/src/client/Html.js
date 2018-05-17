import React, { Component } from 'react';
import Header from './Header.jsx';
import Footer from './Footer';
/**
 * Html
 * This Html.js file acts as a template that we insert all our generated
 * application strings into before sending it to the client.
 */
const Html = ({ body, styles, title }) => `
  <html>
    <head>
      <title>${title}</title>
      ${styles}
      <link rel='stylesheet' href='/style.css' />
    </head>
    ${Header}
    <body style="margin:0">
      <div id="app">${body}</div>
    </body>
    ${Footer}
  </html>
`;


export default Html;