import React from 'react';
import styled from 'styled-components';

// Our single Styled Component definition
const BlogsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  width: 100%;
  height: 100%;
  font-size: 40px;
  background: linear-gradient(20deg, rgb(219, 112, 147), #daa357);
`;


const Blogs = ({ body, styles, blogs }) =>
            <BlogsContainer>
                <table>
                    <thead>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Body</th>
                        <th>Date</th>
                    </thead>
                    <tbody>
                    ${blogs}
                    </tbody>
                </table>
            </BlogsContainer>;

export default Blogs;