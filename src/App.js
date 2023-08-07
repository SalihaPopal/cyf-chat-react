import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const Message = ({ id, from, text, onDelete }) => (
  <div className="message-box">
    <div className="message-content">
      <strong>{from}:</strong> {text}
    </div>
    <button className="delete-button" onClick={() => onDelete(id)}>
      Delete
    </button>
  </div>
);

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  // const fetchMessages = async () => {
  //   try {
  //     const response = await axios.get('https://chat-server-9ecx.onrender.com/messages');
  //     setMessages(response.data);
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //   }
  // };

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleAddMessage = async (e) => {
    e.preventDefault();
    try {
      if (!newMessage.trim() || userName === 'Your Name...') return;

      const response = await axios.post('https://chat-server-9ecx.onrender.com/messages', {
        text: newMessage.trim(),
        from: userName.trim(),
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('https://chat-server-9ecx.onrender.com/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(`https://chat-server-9ecx.onrender.com/messages/${id}`);
      setMessages(messages.filter((message) => message.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleSeeLatest = async () => {
    if (fetching) return;
    
    setFetching(true);
    try {
      const response = await axios.get('https://chat-server-9ecx.onrender.com/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } 
  };

  return (
    <div className='App'>
      <h1>CYF Chat Server</h1>
      <div>
        <div>
          <label htmlFor="userName">Name: </label>
          <input
            type="text"
            id="userName"
            placeholder='Your name...'
            value={userName}
            onChange={handleUserNameChange}
          />
        </div>
        <form onSubmit={handleAddMessage}>
          <label htmlFor="newMessage">Message: </label>
          <input
            type="text"
            id="newMessage"
            placeholder='Message...'
            value={newMessage}
            onChange={handleMessageChange}
          />
          <button type="submit">Send</button>
        </form>
        <button className='latest-btn' onClick={handleSeeLatest} disabled={fetching}>
          {fetching ? 'Fetching...' : 'See Latest'}
        </button>
        <div className="message-container">
          {[...messages].reverse().map((message) => (
            <Message
              key={message.id}
              id={message.id}
              from={message.from}
              text={message.text}
              onDelete={handleDeleteMessage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
