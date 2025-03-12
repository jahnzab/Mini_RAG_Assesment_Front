import React from 'react';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
    <div className="container">
      <a className="navbar-brand" href="#">PDF Chat AI</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><a className="nav-link" href="#upload">Upload</a></li>
          <li className="nav-item"><a className="nav-link" href="#chat">Chat</a></li>
          <li className="nav-item"><a className="nav-link" href="#how-it-works">How It Works</a></li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
