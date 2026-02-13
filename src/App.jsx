import React, { useRef, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import Home from './pages/Home';
import MemoryGallery from './pages/MemoryGallery';
import AddMemory from './pages/AddMemory';

import './App.css';

import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();

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
      <div className="soft-orbs" />

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

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
                <Home />
              </motion.div>
            }
          />

          <Route
            path="/memories"
            element={
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <MemoryGallery />
              </motion.div>
            }
          />

          <Route
            path="/add"
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
              >
                <AddMemory />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
