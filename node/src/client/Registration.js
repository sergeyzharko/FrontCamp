import React from 'react';
import styled from 'styled-components';

// Our single Styled Component definition
const LoginContaienr = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  width: 100%;
  height: 100%;
  font-size: 40px;
  background: linear-gradient(20deg, rgb(219, 112, 147), #daa357);
`;

const Login = () =>
<LoginContaienr>
    <form action="/registration" method="post">
    <div>
        <label>Username:</label>
        <input type="text" name="username"/>
    </div>
    <div>
        <label>Password:</label>
        <input type="password" name="password"/>
    </div>
    <div>
        <input type="submit" value="Register"/>
    </div>
    </form>
</LoginContaienr>;

export default Login;