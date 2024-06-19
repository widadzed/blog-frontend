import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Admin.module.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 403) {
        setMessage('Access denied');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }

      const data = await response.json();
      setter(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteItem = async (endpoint, id, setter) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 403) {
        setMessage('Access denied');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to delete ${endpoint}`);
      }

      const data = await response.json();
      setter(prevItems => prevItems.filter(item => item._id !== id));
      setMessage(`${endpoint} deleted successfully`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchData('users', setUsers);
    fetchData('posts', setPosts);
    fetchData('comments', setComments);
  }, []);

  return (
    <div className={styles.container}>
      <h1>Admin Dashboard</h1>
      {message && <p>{message}</p>}

      <section>
        <h2>Users</h2>
        <ul>
          {users.map(user => (
            <li key={user._id}>
              {user.username}
              <button onClick={() => deleteItem('users', user._id, setUsers)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Posts</h2>
        <ul>
          {posts.map(post => (
            <li key={post._id}>
              {post.title}
              <button onClick={() => deleteItem('posts', post._id, setPosts)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

     
    </div>
  );
};

export default AdminDashboard;
