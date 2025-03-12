// import React, { useState, useRef, useEffect } from 'react';
// import './App.css';

// function App() {
//   const [file, setFile] = useState(null);
//   const [chatId, setChatId] = useState('');
//   const [message, setMessage] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const [uploadedFiles, setUploadedFiles] = useState([]); // ✅ Store uploaded files
//   const chatEndRef = useRef(null);

//   // Auto-scroll to bottom of chat
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [chatHistory]);

//   // ----------------- Handle PDF Upload -----------------
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file || !chatId.trim()) {
//       alert('Please select a PDF file and enter a Chat ID!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('chat_id', chatId.trim());

//     try {
//       const response = await fetch('http://127.0.0.1:8000/upload_pdf/', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Upload Success:', data);
//         alert('✅ PDF uploaded and processed!');
//         setUploadSuccess(true);

//         // ✅ Add the uploaded file name to the uploadedFiles list
//         setUploadedFiles((prev) => [...prev, file.name]);
//         setFile(null); // Clear file input
//       } else {
//         const errorData = await response.json();
//         console.error('Upload failed:', errorData);
//         alert('Upload failed: ' + (errorData.error || 'Unknown error'));
//       }
//     } catch (error) {
//       console.error('Error uploading PDF:', error);
//       alert('Error uploading PDF.');
//     }
//   };

//   // ----------------- Handle Chat -----------------
//   const handleChat = async (e) => {
//     e.preventDefault();
//     if (!chatId || !message.trim()) {
//       alert('Please enter a Chat ID and your message.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('chat_id', chatId);
//     formData.append('message', message);

//     // Add user's message to chat history
//     const userMessage = { role: 'user', content: message };
//     setChatHistory((prev) => [...prev, userMessage]);
//     setMessage(''); // Clear input field
//     setLoading(true); // Show loading indicator

//     try {
//       const response = await fetch('http://127.0.0.1:8000/chat/', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Chat response:', data);
//         // Add bot's message to chat history
//         const botMessage = { role: 'bot', content: data.response };
//         setChatHistory((prev) => [...prev, botMessage]);
//       } else {
//         const errorData = await response.json();
//         console.error('Chat failed:', errorData);
//         alert('Chat failed: ' + (errorData.error || 'Unknown error'));
//       }
//     } catch (error) {
//       console.error('Error sending chat:', error);
//       alert('Error sending chat.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app">
//       <h1>📚 Multi-PDF Chat System</h1>

//       {/* Upload Form */}
//       <form onSubmit={handleUpload} className="upload-form">
//         <input
//           type="text"
//           placeholder="Enter Chat ID"
//           value={chatId}
//           onChange={(e) => setChatId(e.target.value)}
//           required
//           className="input-field"
//         />
//         <input
//           type="file"
//           accept="application/pdf"
//           onChange={(e) => setFile(e.target.files[0])}
//           required
//           className="file-input"
//         />
//         <button type="submit" className="upload-btn">Upload PDF</button>
//       </form>

//       {/* Show uploaded files */}
//       {uploadedFiles.length > 0 && (
//         <div className="uploaded-files">
//           <h3>Uploaded Files:</h3>
//           <ul>
//             {uploadedFiles.map((filename, index) => (
//               <li key={index}>📄 {filename}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Chat Interface */}
//       {uploadSuccess && (
//         <div className="chat-container">
//           <div className="chat-box">
//             {chatHistory.map((msg, idx) => (
//               <div key={idx} className={`chat-message ${msg.role}`}>
//                 <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>

//           <form onSubmit={handleChat} className="chat-form">
//             <input
//               type="text"
//               placeholder="Ask a question..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className="input-field"
//             />
//             <button type="submit" className="send-btn" disabled={loading}>
//               {loading ? 'Sending...' : 'Send'}
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState, useRef, useEffect } from 'react';
import './App.css';

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

  // Load chat IDs and uploaded files from Local Storage on first render
  useEffect(() => {
    const storedChatIds = JSON.parse(localStorage.getItem('chatIds')) || [];
    setChatIds(storedChatIds);
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

    try {
      const response = await fetch('http://127.0.0.1:8000/upload_pdf/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('✅ PDF uploaded and processed!');
        setUploadSuccess(true);

        // Save chatId in chatIds list if not already present
        if (!chatIds.includes(chatId.trim())) {
          const updatedChatIds = [...chatIds, chatId.trim()];
          setChatIds(updatedChatIds);
          localStorage.setItem('chatIds', JSON.stringify(updatedChatIds));
        }

        // Save uploaded file in localStorage under the chat ID
        const storedData = JSON.parse(localStorage.getItem('chatData')) || {};
        const updatedFiles = [...(storedData[chatId] || []), file.name];
        storedData[chatId] = [...new Set(updatedFiles)]; // Avoid duplicates
        localStorage.setItem('chatData', JSON.stringify(storedData));

        setUploadedFiles(storedData[chatId]);
        setFile(null); // Reset file input
      } else {
        const errorData = await response.json();
        alert('Upload failed: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error uploading PDF.');
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
      const response = await fetch('http://127.0.0.1:8000/chat/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = { role: 'bot', content: data.response };
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
      {/* Header */}
      <header className="header">
        <h2>📚 Multiple-PDF Chat using RAG</h2>
        <nav className="navbar">
          <a href="#upload">Upload</a>
          <a href="#about">About</a>
          <a href="#files">Files</a>
          <a href="#chat">Chat</a>
        </nav>
      </header>

      {/* About Section */}
      {/* ✅ About Section */}
      <section id="about" className="about-section">
       <div className="about-content">
    {/* Left Side Text */}
    <div className="about-text">
  <h1>🔍 What is RAG and LangChain?</h1>
  
  <p><strong>Retrieval-Augmented Generation (RAG)</strong> is a cutting-edge technique that blends powerful AI models with smart document retrieval systems. Instead of generating answers from general knowledge, RAG pulls relevant information directly from your uploaded PDFs, giving you context-aware, accurate, and highly relevant answers.</p>
  
  <p><strong>LangChain</strong> is a robust framework designed to create intelligent, context-aware chat systems. It seamlessly integrates AI models, vector databases (like ChromaDB), and document processing tools to enable powerful and scalable chatbot applications, especially for document-heavy tasks like PDF querying.</p>
  
  <h4>⚙️ How Does This System Work?</h4>
  <ol>
    <li><strong>Upload PDFs</strong> — Upload one or multiple PDF files. Our system automatically reads, splits, and stores them in a searchable format (vector embeddings).</li>
    <li><strong>Smart Chunking</strong> — Each PDF is broken down into smaller, meaningful sections or "chunks" that can be searched efficiently.</li>
    <li><strong>Ask Any Question</strong> — You can chat with the system and ask questions related to the content of the uploaded PDFs.</li>
    <li><strong>Document Retrieval</strong> — The system searches for the most relevant chunks from your PDFs that match your question.</li>
    <li><strong>AI-Powered Answer Generation</strong> — Using advanced AI (like Generative AI or LLMs), the system generates an accurate and human-like answer based on the retrieved content.</li>
  </ol>
  
  <h4>🚀 Key Benefits</h4>
  <ul>
    <li>⚡ <strong>Instant Answers</strong> — No need to read entire PDFs. Get answers in seconds.</li>
    <li>🎯 <strong>High Accuracy</strong> — Answers are based on your own documents, ensuring relevance and precision.</li>
    <li>📚 <strong>Multi-PDF Support</strong> — Upload and query multiple PDFs at once.</li>
    <li>🔒 <strong>Privacy First</strong> — Your documents are handled securely for private and sensitive data.</li>
  </ul>
  
  <h4>💡 Use Cases</h4>
  <ul>
    <li>📖 Research and Academic Papers</li>
    <li>⚖️ Legal Documents and Case Files</li>
    <li>🛠️ Technical Manuals and User Guides</li>
    <li>📊 Business Reports and Financial Statements</li>
    <li>🏥 Medical Records and Healthcare Documentation</li>
  </ul>
  
  <p>🌟 Whether you're a researcher, lawyer, student, or business professional, our system makes it easy to extract knowledge from complex PDFs effortlessly.</p>
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
                <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
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
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
