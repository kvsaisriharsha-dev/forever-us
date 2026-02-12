import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const card = document.querySelector('.home-card');
      if (!card) return;

      const x = (window.innerWidth / 2 - e.clientX) / 40;
      const y = (window.innerHeight / 2 - e.clientY) / 40;

      card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    };

    const handleMouseLeave = () => {
      const card = document.querySelector('.home-card');
      if (card) {
        card.style.transform = `rotateY(0deg) rotateX(0deg)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="hero">
      <div className="home-card glass">
        <p className="badge">Private access</p>

        <h1 className="home-title">Enter Our Universe</h1>

        <p className="description">A digital world made only for us ✨</p>

        <button className="enter-btn" onClick={() => navigate('/memories')}>
          💜 Enter Our Memories
        </button>
      </div>
    </div>
  );
}
