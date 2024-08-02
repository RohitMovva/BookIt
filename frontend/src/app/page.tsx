// pages/index.tsx or app/page.tsx

"use client"; // This line marks the component as a Client Component

import { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Replace 'http://127.0.0.1:5000/api/test' with your Flask backend URL if different
    axios.get('http://127.0.0.1:5000/api/test')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Flask Backend Test</h1>
      <p>{message ? `Message from Flask: ${message}` : 'Loading...'}</p>
    </div>
  );
};

export default HomePage;
