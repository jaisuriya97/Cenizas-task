import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState(null); // Add state for session_id

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setError('');
      setMessages(response.data.history || []);
      setSessionId(response.data.session_id); // Store session_id
      console.log('Session ID:', response.data.session_id); // Debug
      alert(response.data.message);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error uploading file.');
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Question cannot be empty.');
      return;
    }
    if (!sessionId) {
      setError('Please upload a PDF first to start a session.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/ask', {
        question,
        session_id: sessionId, // Include session_id in payload
      });
      setMessages(response.data.history);
      setQuestion('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error processing question.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Document Q&A</h1>
      <div className="mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />
        <button
          onClick={handleFileUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload PDF
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="border p-4 h-96 overflow-y-auto mb-4">
        {messages.length === 0 && (
          <p className="text-gray-500">No questions asked yet.</p>
        )}
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <p className="font-bold">Q: {msg.question}</p>
            <p>A: {msg.answer}</p>
            <p className="text-xs text-gray-400">{msg.timestamp}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleAskQuestion} className="flex">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the document"
          className="flex-1 border p-2 rounded-l"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-r">
          Ask
        </button>
      </form>
    </div>
  );
}

export default App;