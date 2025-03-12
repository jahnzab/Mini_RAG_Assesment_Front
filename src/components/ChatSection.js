import React, { useState } from 'react';

const ChatSection = ({ handleChat, chatResponse }) => {
  const [message, setMessage] = useState('');

  return (
    <section id="chat" className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">Chat with Your PDF</h2>
        <div className="chat-box p-3 bg-white shadow rounded mb-3">
          {chatResponse && <div className="chat-response bg-primary text-white p-2 rounded">{chatResponse}</div>}
        </div>
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Ask something..." value={message} onChange={(e) => setMessage(e.target.value)} />
          <button className="btn btn-primary" onClick={() => handleChat(message)}>Send</button>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;
