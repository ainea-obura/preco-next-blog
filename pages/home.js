import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://b723-197-248-65-3.ngrok-free.app/api/blogs/all', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blog);
      } else {
        console.error('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCommentSubmit = async (blogId, commentText) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://b723-197-248-65-3.ngrok-free.app/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          blog_id: blogId,
          comment: commentText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Comment added:', data);
        // Refresh the blogs after comment submission
        fetchBlogs();
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      <h2>Blogs</h2>
      <Link href="/create_blog">
        <a>Create Blog</a> 
      </Link>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const commentText = e.target.comment.value;
                handleCommentSubmit(blog.id, commentText);
                e.target.reset();
              }}
            >
              <input type="text" name="comment" placeholder="Add a comment" />
              <button type="submit">Add Comment</button>
            </form>
            <ul>
              {blog.comments.map((comment) => (
                <li key={comment.id}>{comment.comment}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
