import { useState } from 'react';
import { useRouter } from 'next/router';

const CreateBlog = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://127.0.0.1:8001/api/blog/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Blog created:', data);
        // Redirect to homepage upon successful blog creation
        router.push('/home');
      } else {
        console.error('Failed to create blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <div>
      <h2>Create Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Blog</button>
      </form>
    </div>
  );
};

export default CreateBlog;
