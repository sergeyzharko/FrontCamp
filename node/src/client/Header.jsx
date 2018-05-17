import React from 'react';
// import styled from 'styled-components';
// import './header.css';


// const HeaderContaienr = styled.header`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   position: fixed;
//   width: 100%;
//   height: 100%;
//   font-size: 40px;
//   background: linear-gradient(20deg, rgb(219, 112, 147), #daa357);
// `;

const Header = () => `
<HeaderContaienr>
  <header>
  <nav class="one">
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">Work</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Blog</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
  </header>
</HeaderContaienr>
`;

export default Header();