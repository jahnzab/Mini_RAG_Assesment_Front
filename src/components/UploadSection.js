import React, { useState } from 'react';

const UploadSection = ({ handleUpload }) => {
  const [file, setFile] = useState(null);
  const [chatId, setChatId] = useState('');

  return (
    <section id="upload" className="py-5 text-center">
      <h2>Upload Your PDF</h2>
      <div className="container">
        <input type="file" className="form-control my-3" onChange={(e) => setFile(e.target.files[0])} />
        {file && <p className="text-success">Selected: {file.name}</p>}
        <input type="text" className="form-control my-3" placeholder="Enter Chat ID" value={chatId} onChange={(e) => setChatId(e.target.value)} />
        <button className="btn btn-success" onClick={() => handleUpload(file, chatId)}>Upload & Process</button>
      </div>
    </section>
  );
};

export default UploadSection;
