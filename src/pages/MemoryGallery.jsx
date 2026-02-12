import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function MemoryGallery() {
  const [memories, setMemories] = useState([]);

  // Fetch memories
  useEffect(() => {
    fetch('https://forever-us-backend.onrender.com/api/memories')
      .then((res) => res.json())
      .then((data) => setMemories(data))
      .catch((err) => console.error(err));
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.pageYOffset;
      const wrapper = document.querySelector('.gallery-wrapper');
      if (wrapper) {
        wrapper.style.transform = `translateY(${offset * 0.03}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Delete memory
  const deleteMemory = async (id) => {
    try {
      await fetch(
        `https://forever-us-backend.onrender.com/api/memories/${id}`,
        { method: 'DELETE' }
      );

      setMemories((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="gallery-wrapper">
      <motion.h2
        className="gallery-title"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Our Memories 💜
      </motion.h2>

      <div className="memory-grid">
        {memories.length === 0 ? (
          <motion.div
            className="empty-state glass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h3>No memories yet 💫</h3>
            <p>Start creating beautiful moments together.</p>
          </motion.div>
        ) : (
          memories.map((memory) => (
            <motion.div
              key={memory._id}
              className="memory-card glass"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="memory-image-wrapper">
                <img
                  src={memory.imageUrl || '/fallback.jpg'}
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9';
                  }}
                  alt={memory.title}
                  className="memory-image"
                />
              </div>

              <div className="memory-content">
                <h3>{memory.title}</h3>
                <p>{memory.note}</p>

                <div className="memory-footer">
                  <span className="memory-date">
                    {new Date(memory.date).toDateString()}
                  </span>

                  <button
                    className="delete-btn"
                    onClick={() => deleteMemory(memory._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
