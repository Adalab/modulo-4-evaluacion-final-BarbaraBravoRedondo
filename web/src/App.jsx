// App.jsx
import React, { useState, useEffect } from 'react';
import api from './services/api';
import user from './services/user';
import './styles/main.scss'; 

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [dreams, setDreams] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeForm, setActiveForm] = useState('login');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await user.sendLoginToApi({ email, password });
      setLoggedIn(true);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await user.sendSignUpToApi({ email, password });
      setLoggedIn(true);
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getDreamsFromApi();
        setDreams(data.results);
      } catch (error) {
        console.error('Error fetching dreams:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div className="container">
      {!loggedIn && (
        <div className="form-container">
          <button
            className={`switch-button ${activeForm === 'signup' ? 'active-form' : ''}`}
            onClick={() => setActiveForm('signup')}
          >
            Sign Up
          </button>
          <button
            className={`switch-button ${activeForm === 'login' ? 'active-form' : ''}`}
            onClick={() => setActiveForm('login')}
          >
            Login
          </button>

          {activeForm === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <label>Email:</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Login</button>
            </form>
          )}

          {activeForm === 'signup' && (
            <form onSubmit={handleSignUpSubmit}>
              <label>Email:</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Sign Up</button>
            </form>
          )}
        </div>
      )}

      {loggedIn && (
        <div>
          <h2>Listado de Sueños</h2>
          <ul>
            {dreams.map((dream) => (
              <li key={dream.id}>{dream.description}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
