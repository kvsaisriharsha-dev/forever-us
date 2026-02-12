import React, { useRef, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import Home from './pages/Home';
import MemoryGallery from './pages/MemoryGallery';
import AddMemory from './pages/AddMemory';

import './App.css';

export default function App() {
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  const handleAudioUpload = (file) => {
    const url = URL.createObjectURL(file);
    setAudioFile(url);
  };

  return (
    <div className="page">
      <nav className="navbar glass">
        <div className="logo">
          💜 <span>Forever Us</span>
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/memories">Memory Gallery</Link>
          <Link to="/add">Add Memory</Link>

          {/* 🎵 Music Section */}
          <div className="music-nav">
            <button
              className={`music-icon ${playing ? 'active' : ''}`}
              onClick={toggleMusic}
            >
              🎵
            </button>

            <input
              type="file"
              accept="audio/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => handleAudioUpload(e.target.files[0])}
            />

            <button
              className="upload-audio"
              onClick={() => fileInputRef.current.click()}
            >
              +
            </button>

            {audioFile && <audio ref={audioRef} src={audioFile} loop />}
          </div>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memories" element={<MemoryGallery />} />
          <Route path="/add" element={<AddMemory />} />
        </Routes>
      </motion.div>
    </div>
  );
}
