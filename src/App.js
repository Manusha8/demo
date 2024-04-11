import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('');
  const [stdin, setStdin] = useState('');
  const [code, setCode] = useState('');
  const [snippets, setSnippets] = useState([]);
  const [error, setError] = useState('');

  const backendUrl = 'http://localhost:3000'; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/snippets`, { username, language, stdin, code });
      console.log('Snippet submitted:', response.data);
      setUsername('');
      setLanguage('');
      setStdin('');
      setCode('');
      setError('');
      fetchSnippets(); 
    } catch (error) {
      console.error(error);
      setError('Error submitting snippet!');
    }
  };

  const fetchSnippets = async () => {
    try {
      const response = await axios.get(`${backendUrl}/snippets`);
      setSnippets(response.data);
    } catch (error) {
      console.error(error);
      setError('Error retrieving snippets!');
    }
  };

  useEffect(() => {
    fetchSnippets(); 
  }, []);

  return (
    <div className="App">
      <h1>Code Snippet Sharing</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        
        <label>
          Language:
          <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} required />
        </label>
        <label>
          Stdin:
          <input type="text" value={stdin} onChange={(e) => setStdin(e.target.value)} required />
        </label>
        <label>
          Code:
          <textarea value={code} onChange={(e) => setCode(e.target.value)} required />
        </label>
        
        <button type="submit">Submit</button>
      </form>

      {error && <p>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Language</th>
            <th>Stdin</th>
            <th>Code</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {snippets.map((snippet) => (
            <tr key={snippet._id}>
              <td>{snippet.username}</td>
              <td>{snippet.language}</td>
              <td>{snippet.stdin}</td>
              <td>{snippet.code.substring(0, 100) + (snippet.code.length > 100 ? '...' : '')}</td>
              <td>{snippet.submittedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;