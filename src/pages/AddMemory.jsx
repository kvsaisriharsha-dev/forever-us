import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddMemory() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    note: '',
    date: '',
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Upload State
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('note', form.note);
    formData.append('date', form.date);
    if (image) formData.append('image', image);

    setUploading(true);
    setProgress(0);

    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://forever-us-backend.onrender.com/api/memories');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate('/memories');
      }, 1500);
    };

    xhr.onerror = () => {
      setUploading(false);
      alert('Upload failed ❌');
    };

    xhr.send(formData);
  };

  return (
    <div className="form-container">
      <h2>Add New Memory 💜</h2>

      <form onSubmit={handleSubmit} className="memory-form glass">
        {/* Floating Title */}
        <div className="floating-group">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <label>Memory Title</label>
        </div>

        {/* Floating Note */}
        <div className="floating-group">
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            required
          />
          <label>Your Memory</label>
        </div>

        {/* Floating Date */}
        <div className="floating-group">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <label>Date</label>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => handleImage(e.target.files[0])}
        />

        {/* Drag & Drop */}
        <div
          className="drop-zone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <div className="drop-icon">📷</div>
          <p>Drag & Drop Image Here</p>
          <span>or click to browse</span>
        </div>

        {/* Preview */}
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="success-check">✓ Memory Saved Successfully 💜</div>
        )}

        <button className="gradient-btn" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Save Memory'}
        </button>
      </form>
    </div>
  );
}
