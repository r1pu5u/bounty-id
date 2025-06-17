import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    avatar: '',
    points: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        avatar: response.data.avatar
      });
    } catch (err) {
      setError('Gagal mengambil data profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await userAPI.updateProfile(formData);
      setProfile(response.data);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
        {!editMode && (
          <button 
            className="edit-button"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Avatar URL</label>
            <input
              type="text"
              value={formData.avatar}
              onChange={(e) => setFormData({...formData, avatar: e.target.value})}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Simpan'}
            </button>
            <button 
              type="button" 
              onClick={() => setEditMode(false)}
              className="cancel-button"
            >
              Batal
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="avatar-container">
            <img 
              src={profile.avatar || '/default-avatar.png'} 
              alt="Profile" 
              className="profile-avatar"
            />
          </div>
          
          <div className="info-group">
            <label>Username</label>
            <p>{profile.username}</p>
          </div>

          <div className="info-group">
            <label>Email</label>
            <p>{profile.email}</p>
          </div>

          <div className="info-group">
            <label>Points</label>
            <p>{profile.points}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile; 