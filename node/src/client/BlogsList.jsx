import React, { Component } from "react";
//import css from "./BlogsList.css";

class NewsList extends Component {

  render() {
    const blogs = this.props.blogs;
    const name = this.props.name;
    const maxId = this.props.maxId;
    // console.log(maxId);

    return (
      <div>
        <table className='customers'>
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

        <form method='POST'>
          <fieldset>
            <legend>New post:</legend>
            ID:<br/>
            <input type="text" name="id" defaultValue={maxId+1}/><br/><br/>
            Title:<br/>
            <input type="text" name="title"/><br/><br/>
            Author:<br/>
            <input type="text" name="author" defaultValue={name}/><br/><br/>
            Body:<br/>
            <input type="text" name="body"/><br/><br/>
            <input type="submit" value="Submit"/>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default NewsList;