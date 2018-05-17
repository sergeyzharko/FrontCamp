import React, { Component } from "react";
import "./BlogsList.css";

class NewsList extends Component {

  render() {
    const blogs = this.props.blogs;

    return (
      <table className="customers">
          <thead>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Body</th>
          </thead>
        {blogs &&
          blogs.map(post =>
            <tr key={post._id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.author}</td>
              <td>{post.body}</td>
            </tr>
          )}
      </table>
    );
  }
}

export default NewsList;