import React from 'react';
import styled from 'styled-components';

// Our single Styled Component definition
const AppContaienr = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  width: 100%;
  height: 100%;
  font-size: 40px;
  background: linear-gradient(20deg, rgb(219, 112, 147), #daa357);
`;

const App = () => { return ( <AppContaienr>
    Welcome!
    <ul>
    <li><a href="login">Login</a></li>
    <li><a href="logout">Logout</a></li>
    <li><a href="registration">Registration</a></li>
    <li><a href="blogs">Blogs</a></li>
    </ul>
</AppContaienr> );
};

export default App;