import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [newPostCategories, setNewPostCategories] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [message, setMessage] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);


  const fetchPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE}posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response status:', response.status);
      console.log('API Base URL:', import.meta.env.VITE_BASE);

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      console.log(data);
      console.log('Fetched posts:', data);
      setPosts(data);
    } catch (error) {
      console.error('Fetch error:', error.message);
      setMessage(error.message);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please login to create a post');
      return;
    }
    const formData = new FormData();
    formData.append('title', newPostTitle);
    formData.append('content', newPostBody);
    formData.append('categories', newPostCategories.split(','));
    formData.append('tags', newPostTags.split(','));
  
    if (newPostImage) {
      formData.append('file', newPostImage);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE}posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Post created successfully!');
        fetchPosts();
        setNewPostTitle('');
        setNewPostBody('');
        setNewPostCategories('');
        setNewPostTags('');
        setNewPostImage(null);
        setPreviewImage(null);
      } else {
        setMessage(data.message || 'Failed to create post');
      }
    } catch (error) {
      setMessage('Failed to create post');
    }
  };

  useEffect(() => {
   
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
   
    setNewPostImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  return (
    <div className={styles.container}>
    <div className={styles.content}>
      <div className={styles.createPost}>
        <form onSubmit={handleCreatePost}>
          <h2>Create Post</h2>
          <input
            type="text"
            placeholder="Title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Body"
            value={newPostBody}
            onChange={(e) => setNewPostBody(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Categories (comma separated)"
            value={newPostCategories}
            onChange={(e) => setNewPostCategories(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={newPostTags}
            onChange={(e) => setNewPostTags(e.target.value)}
          />
            <input
              type="file"
              name='file'
              onChange={handleImageChange}
            />
          {previewImage && <img src={previewImage} alt="Preview" className={styles.previewImage} />}

          <button type="submit">Create</button>
        </form>
        {message && <p>{message}</p>}
      </div>

      <h1 className={styles.headerpost}>Posts</h1>
      {posts.length === 0 && <p>No posts available.</p>}
      <ul className={styles.postsList}>
        {posts.map((post) => (
          <li key={post._id} className={styles.postItem}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {post.image && <img src={`${import.meta.env.VITE_BASE}${post.image}`} alt={post.title} className={styles.postImage} />}
            <p>{`${import.meta.env.VITE_BASE}${post.image}`}</p>

            <p><strong>Categories:</strong> {post.categories.join(', ')}</p>
            <p><strong>Tags:</strong> {post.tags.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
};

export default Home;




