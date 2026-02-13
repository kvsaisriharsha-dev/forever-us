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

  // ✅ handle input
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ handle image
  const handleImage = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImage(file);
  };

  // 🚀 FINAL SUBMIT (ULTRA FIXED)
  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ extra safety validation
    if (!form.title || !form.note || !form.date) {
      alert('Please fill all required fields 💜');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title.trim());
    formData.append('note', form.note.trim());
    formData.append('date', form.date);

    if (image) {
      formData.append('image', image);
    }

    setUploading(true);
    setProgress(0);

    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://forever-us-backend.onrender.com/api/memories');

    // ✅ progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    // ✅ SUCCESS + ERROR HANDLING (VERY IMPORTANT)
    xhr.onload = () => {
      setUploading(false);

      if (xhr.status >= 200 && xhr.status < 300) {
        setSuccess(true);

        // reset form
        setForm({ title: '', note: '', date: '' });
        setImage(null);
        setPreview(null);

        // navigate after short delay
        setTimeout(() => {
          navigate('/memories', { replace: true });
          window.location.reload(); // 🔥 ensures fresh fetch
        }, 1200);
      } else {
        console.error('Server error:', xhr.responseText);
        alert('Server rejected the memory ❌');
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      alert('Upload failed ❌');
    };

    // ❗ IMPORTANT: DO NOT SET HEADERS
    xhr.send(formData);
  };

  return (
    <div className="form-container">
      <h2>Add New Memory 💜</h2>

      <form onSubmit={handleSubmit} className="memory-form glass">
        {/* Title */}
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

        {/* Note */}
        <div className="floating-group">
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            required
          />
          <label>Your Memory</label>
        </div>

        {/* Date */}
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

        {/* Hidden File */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => handleImage(e.target.files[0])}
        />

        {/* Drop Zone */}
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

        {/* Progress */}
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
