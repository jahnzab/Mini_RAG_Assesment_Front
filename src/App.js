import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DebugPanel from './DebugPanel';
function App() {
  const [file, setFile] = useState(null);
  const [chatId, setChatId] = useState('');
  const [chatIds, setChatIds] = useState([]);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const chatEndRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  

useEffect(() => {
  const fetchChatIds = async () => {
    try {
      const res = await fetch("https://mini-rag-assesment-backend.onrender.com/list_chats/");
      if (!res.ok) throw new Error("Failed to fetch chat IDs");
      const data = await res.json();
      
      setChatIds(data?.chat_ids || []);
    } catch (err) {
      console.error("❌ Error fetching chat IDs:", err);
      setChatIds([]); // Just set empty array if backend fails
    }
  };
  fetchChatIds();
}, []);
  // Scroll chat to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Handle chat ID selection
  const handleChatIdChange = (e) => {
    const selectedChatId = e.target.value;
    setChatId(selectedChatId);
    const storedData = JSON.parse(localStorage.getItem('chatData')) || {};
    const files = storedData[selectedChatId] || [];
    setUploadedFiles(files);
    setUploadSuccess(files.length > 0);
  };
  
const deleteChat = async (chatIdToDelete) => {
  try {
    const response = await fetch(`https://mini-rag-assesment-backend.onrender.com/delete_chat/${chatIdToDelete}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setMessage(`✅ Chat ID '${chatIdToDelete}' deleted successfully`);

      // Remove from UI state
      const updatedChatIds = chatIds.filter(id => id !== chatIdToDelete);
      setChatIds(updatedChatIds);
      setUploadedFiles(prev => prev.filter(file => file.chatId !== chatIdToDelete));

      // Reset view if deleted
      if (chatId === chatIdToDelete) {
        setChatId('');
        setChatHistory([]);
      }

      // 🔥 Update localStorage
      localStorage.setItem('chatIds', JSON.stringify(updatedChatIds));
      const chatData = JSON.parse(localStorage.getItem('chatData')) || {};
      delete chatData[chatIdToDelete];
      localStorage.setItem('chatData', JSON.stringify(chatData));
      
    } else {
      const data = await response.json();
      setMessage(`❌ ${data.detail}`);
    }
  } catch (err) {
    console.error("Error deleting chat:", err);
    setMessage("❌ Failed to delete chat.");
  }
};

  // Handle File Upload
  const handleUpload = async (e) => {
  e.preventDefault();
  if (!file || !chatId.trim()) {
    alert('Please select a PDF file and enter a Chat ID!');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('chat_id', chatId.trim());

  setUploading(true);  // Start loader

  try {
    const response = await fetch('https://mini-rag-assesment-backend.onrender.com/upload_pdf/', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      alert(`✅ PDF uploaded and processed with ${data.llm_model || 'Grok 3'}!`);
      setUploadSuccess(true);

      if (!chatIds.includes(chatId.trim())) {
        const updatedChatIds = [...chatIds, chatId.trim()];
        setChatIds(updatedChatIds);
        localStorage.setItem('chatIds', JSON.stringify(updatedChatIds));
      }

      const storedData = JSON.parse(localStorage.getItem('chatData')) || {};
      const updatedFiles = [...(storedData[chatId] || []), file.name];
      storedData[chatId] = [...new Set(updatedFiles)];
      localStorage.setItem('chatData', JSON.stringify(storedData));

      setUploadedFiles(storedData[chatId]);
      setFile(null);
    } else {
      const errorData = await response.json();
      alert('Upload failed: ' + (errorData.error || 'Unknown error'));
    }
  } catch (error) {
    alert('Error uploading PDF.');
  } finally {
    setUploading(false);  // End loader
  }
};

  
  // Handle Chat Message
  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatId || !message.trim()) {
      alert('Please enter a Chat ID and your message.');
      return;
    }

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('message', message);

    const userMessage = { role: 'user', content: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('https://mini-rag-assesment-backend.onrender.com/chat/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = { 
          role: 'bot', 
          content: data.response || data.answer || "No reply from bot.",
          sources: data.sources || [],
          processingTime: data.processing_time || 0,
          llmModel: data.llm_model || 'Grok 3'
        };
        setChatHistory((prev) => [...prev, botMessage]);
      } else {
        const errorData = await response.json();
        alert('Chat failed: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error sending chat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

    {/* Add Debug Panel at the top */}
      <DebugPanel />
      {/* Header */}
    
      <header className="header">
        <h2>🤖 Multiple-PDF Chat using RAG + Grok 3</h2>
        <div className="model-info">
          <span className="badge bg-success">🚀 Powered by Grok 3</span>
          <span className="badge bg-primary">📊 Pinecone Vector DB</span>
        </div>
        <nav className="navbar">
          <a href="#upload">Upload</a>
          <a href="#about">About</a>
          <a href="#files">Files</a>
          <a href="#chat">Chat</a>
        </nav>
      </header>

      {/* About Section */}
      <section id="about" className="about-section">
       <div className="about-content">
    {/* Left Side Text */}
    <div className="about-text">
  <h1>🔍 What is RAG with Grok 3?</h1>
  
  <p><strong>Retrieval-Augmented Generation (RAG)</strong> is a cutting-edge technique that blends powerful AI models with smart document retrieval systems. Now powered by <strong>Grok 3</strong>, our system provides faster, more accurate, and contextually relevant answers from your uploaded PDFs.</p>
  
  <p><strong>Grok 3</strong> is the latest breakthrough AI model that excels at understanding complex queries and generating human-like responses with exceptional speed and accuracy. Combined with our advanced RAG pipeline, it delivers superior performance compared to traditional models.</p>
  
  <h4>⚙️ How Does This Enhanced System Work?</h4>
  <ol>
    <li><strong>Upload PDFs</strong> — Upload one or multiple PDF files. Our system automatically reads, splits, and stores them in a searchable format (vector embeddings).</li>
    <li><strong>Smart Chunking</strong> — Each PDF is broken down into smaller, meaningful sections or "chunks" that can be searched efficiently.</li>
    <li><strong>Ask Any Question</strong> — You can chat with the system and ask questions related to the content of the uploaded PDFs.</li>
    <li><strong>Document Retrieval</strong> — The system searches for the most relevant chunks from your PDFs that match your question.</li>
    <li><strong>Grok 3 Powered Answers</strong> — Using Grok 3's advanced capabilities, the system generates accurate and human-like answers based on the retrieved content.</li>
  </ol>
  
  <h4>🚀 Why Grok 3?</h4>
  <ul>
    <li>⚡ <strong>Lightning Fast</strong> — Responses in seconds, not minutes</li>
    <li>🎯 <strong>Superior Accuracy</strong> — Better understanding of complex queries</li>
    <li>🧠 <strong>Advanced Reasoning</strong> — Handles nuanced questions with context</li>
    <li>💰 <strong>Cost Effective</strong> — Optimized performance at lower costs</li>
  </ul>
  
  <h4>💡 Use Cases</h4>
  <ul>
    <li>📖 Research and Academic Papers</li>
    <li>⚖️ Legal Documents and Case Files</li>
    <li>🛠️ Technical Manuals and User Guides</li>
    <li>📊 Business Reports and Financial Statements</li>
    <li>🏥 Medical Records and Healthcare Documentation</li>
  </ul>
  
  <p>🌟 Experience the next generation of document interaction with Grok 3's lightning-fast responses and superior understanding.</p>
  </div>
 {/* Right Side Image */}
 <div className="about-image">
      <img src="/RAG.png" alt="AI and Document Interaction" />
    </div>
  </div>
</section>

      {/* Upload Section */}
      <div id="upload-section" className="upload-section">
        <h1 id="upload">📤 Upload PDFs</h1>
          {/* Loader appears while uploading */}
  {uploading && (
    <div className="loader">
      ⏳ Processing with Grok 3...
    </div>
  )}
 
        <form onSubmit={handleUpload} className="upload-form">
          <select value={chatId} onChange={handleChatIdChange} className="input-field">
            <option value="">-- Select Chat ID --</option>
            {chatIds.map((id, index) => (
              <option key={index} value={id}>{id}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Or enter new Chat ID"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            className="input-field"
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="file-input"
          />

          <button type="submit" className="upload-btn">Upload PDF</button>
           <button className="btn btn-danger" style={{ width: '130px', height: '45px' }}onClick={() => deleteChat(chatId)}> Delete Chat ID</button>

        </form>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="uploaded-files" id="files">
            <h3>📁 Uploaded Files for Chat ID: {chatId}</h3>
            <ul>
              {uploadedFiles.map((filename, index) => (
                <li key={index}>📄 {filename}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Chat Interface */}
      {uploadSuccess && (
        <div className="chat-container" id="chat">
          <div className="chat-box">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <strong>{msg.role === 'user' ? 'You' : 'Grok 3 Bot'}:</strong> {msg.content}
                {msg.role === 'bot' && msg.processingTime && (
                  <div className="message-meta">
                    <small>⏱️ Response time: {msg.processingTime}s | 🤖 {msg.llmModel}</small>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleChat} className="chat-form">
            <input
              type="text"
              placeholder="Ask a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="send-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send to Grok 3'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
