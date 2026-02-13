import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
  const btnRef = useRef(null);

  const handleMove = (e) => {
    if (!btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    btnRef.current.style.setProperty('--x', `${x}px`);
    btnRef.current.style.setProperty('--y', `${y}px`);
  };

  return (
    <div className="home-wrapper">
      {/* MAIN GLASS LAYOUT */}
      <div className="home-grid">
        {/* LEFT BIG CARD */}
        <motion.div
          className="glass-card hero-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge">🔒 Private access</span>

          <h1 className="hero-title">Enter our world</h1>

          <p className="hero-subtitle">
            Forever Us is a quiet digital space made only for your most
            beautiful memories together.
          </p>

          <div className="hero-actions">
            <Link
              ref={btnRef}
              onMouseMove={handleMove}
              to="/memories"
              className="primary-pill magnetic-btn"
            >
              💜 Enter Our Memories
            </Link>
          </div>
        </motion.div>

        {/* RIGHT INFO CARD */}
        <motion.div
          className="glass-card info-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3>What lives here</h3>

          <ul className="feature-list">
            <li>📸 Memory Gallery with photos</li>
            <li>💬 Conversations with favorites</li>
            <li>🕰️ Timeline of your journey</li>
            <li>🔐 Secret Notes (coming soon)</li>
          </ul>

          <div className="tip-box">
            Tip: Turn on background music for vibes ✨
          </div>
        </motion.div>
      </div>
    </div>
  );
}
