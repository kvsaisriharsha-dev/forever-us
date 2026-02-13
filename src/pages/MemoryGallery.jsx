import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MemoryGallery() {
  const [selected, setSelected] = useState(null);
  const [memories, setMemories] = useState([]);

  // ✅ Fetch memories
  // 🔥 reusable loader
  const loadMemories = async () => {
    try {
      const res = await fetch(
        'https://forever-us-backend.onrender.com/api/memories'
      );
      const data = await res.json();

      setMemories(
        data.map((m) => ({
          ...m,
          liked: false,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // initial load
  useEffect(() => {
    loadMemories();
  }, []);

  // ✅ Parallax scroll effect (safe)
  useEffect(() => {
    const handleScroll = () => {
      const wrapper = document.querySelector('.gallery-wrapper');
      if (!wrapper) return;

      const offset = window.pageYOffset;
      wrapper.style.transform = `translateY(${offset * 0.02}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const deleteMemory = async (id) => {
    try {
      const res = await fetch(
        `https://forever-us-backend.onrender.com/api/memories/${id}`,
        { method: 'DELETE' }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Delete failed');
      }

      // ✅ reload after successful delete
      loadMemories();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed ❌');
    }
  };

  // 🔥 refresh when user returns to tab
  useEffect(() => {
    const handleFocus = () => loadMemories();

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // ❤️ Like toggle
  const toggleLike = (id) => {
    setMemories((prev) =>
      prev.map((m) => (m._id === id ? { ...m, liked: !m.liked } : m))
    );
  };

  return (
    <>
      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="memory-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="memory-modal-card"
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={
                  selected.imageUrl && selected.imageUrl.trim() !== ''
                    ? selected.imageUrl
                    : 'https://images.unsplash.com/photo-1517841905240-472988babdf9'
                }
                alt={selected.title}
              />

              <h3>{selected.title}</h3>
              <p>{selected.note}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= GALLERY ================= */}
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
                className="memory-card glass tilt-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                onClick={() => setSelected(memory)}
              >
                {/* IMAGE */}
                <div className="memory-image-wrapper">
                  <button
                    className={`like-btn ${memory.liked ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('LIKE CLICKED', memory._id);
                      toggleLike(memory._id);
                    }}
                  >
                    💜
                  </button>

                  <img
                    src={
                      memory.imageUrl && memory.imageUrl.trim() !== ''
                        ? memory.imageUrl
                        : 'https://images.unsplash.com/photo-1517841905240-472988babdf9'
                    }
                    alt={memory.title}
                    className="memory-image"
                  />
                </div>

                {/* CONTENT */}
                <div className="memory-content">
                  <h3>{memory.title}</h3>
                  <p>{memory.note}</p>

                  <div className="memory-footer">
                    <span className="memory-date">
                      {new Date(memory.date).toDateString()}
                    </span>

                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMemory(memory._id);
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
