import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import styles from './Admin.module.css';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { IconButton } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  const fetchData = async (endpoint, setter) => {
    try {
      const url = `${import.meta.env.VITE_BASE}admin/${endpoint}`;
      console.log(`Fetching from: ${url}`);

      const response = await fetch(url, {
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
      const url = `${import.meta.env.VITE_BASE}admin/${endpoint}/${id}`;
      console.log(`Deleting from: ${url}`);

      const response = await fetch(url, {
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

      setter(prevItems => prevItems.filter(item => item._id !== id));
      setMessage(`${endpoint} deleted successfully`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchData('users', setUsers);
    fetchData('posts', setPosts);
  }, []);
  const handleCardClick = (post) => {
    setSelectedPost(post); 
  };

  const handleClose = () => {
    setSelectedPost(null);
  };
  const handleDelete = (postId) => {
    deleteItem('posts', postId, setPosts);
  };
  
   
    return (
      <div className={styles.container}>
      <h1 className={styles.h1}>Admin Dashboard</h1>
      {message && <p>{message}</p>}

      <div className={styles.cardContainer}>
        {posts.map(post => {
          const user = users.find(user => user._id === post.user._id);
          return (
            <Card key={post._id} className={styles.card}>
              <CardActionArea onClick={() => handleCardClick(post)}>
                <CardMedia
                  component="img"
                  height="140"
                  image="/static/images/cards/contemplative-reptile.jpg"
                  alt="Post Image"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {user ? user.username : 'Unknown User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <IconButton
                aria-label="delete"
                onClick={() => handleDelete(post._id)}
                className={styles.deleteButton}
               
              >
                <DeleteIcon />
              </IconButton>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedPost} onClose={handleClose}>
        {selectedPost && (
          <>
            <DialogTitle>{selectedPost.title}</DialogTitle>
            <DialogContent>
              <Typography variant="body1">{selectedPost.content}</Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
    );
};

export default AdminDashboard;

