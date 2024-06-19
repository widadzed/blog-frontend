/*import React, { useState, useEffect } from 'react';

import Navbar from '../component/Navbar';
import styles from './Home.module.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/posts/');
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
   <Navbar/>
      <div className={styles.container}>
        <h2>Latest Posts</h2>
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postBody}>{post.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;*/

import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [newPostCategories, setNewPostCategories] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [message, setMessage] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No token found');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          title: newPostTitle, 
          content: newPostBody, 
          categories: newPostCategories.split(','), 
          tags: newPostTags.split(',') 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Post created successfully!');
        fetchPosts();
        setNewPostTitle('');
        setNewPostBody('');
        setNewPostCategories('');
        setNewPostTags('');
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
              placeholder="Categories "
              value={newPostCategories}
              onChange={(e) => setNewPostCategories(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tags "
              value={newPostTags}
              onChange={(e) => setNewPostTags(e.target.value)}
            />
            <button type="submit">Create</button>
          </form>
          {message && <p>{message}</p>}
        </div>

        <h1>Posts</h1>
        {posts.length === 0 && <p>No posts available.</p>}
        <ul className={styles.postsList}>
          {posts.map((post) => (
            <li key={post._id} className={styles.postItem}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p><strong>Categories:</strong> {post.categories.join(', ')}</p>
              <p><strong>Tags:</strong> {post.tags.join(', ')}</p>
              {/* Add comments display here */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;



