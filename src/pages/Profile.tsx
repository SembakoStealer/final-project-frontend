// src/pages/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  createdAt: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    bio: '',
    createdAt: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get<UserProfile>(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;

        // Format createdAt date
        const createdAtDate = new Date(data.createdAt);
        const formattedDate = createdAtDate.toISOString().split('T')[0];

        setProfile({
          name: data.name || '',
          email: data.email || '',
          bio: data.bio || '',
          createdAt: formattedDate
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleBackClick = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="container mx-auto px-4 py-6">
        <button 
          onClick={handleBackClick}
          className="font-bold text-xl"
        >
          Back
        </button>
      </div>

      {/* Profile card */}
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          {/* Profile picture */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-200"></div>
          </div>

          {/* Profile info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Name:</label>
              <input
                type="text"
                value={profile.name}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Email:</label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Bio:</label>
              <input
                type="text"
                value={profile.bio || 'Add Something Here'}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Created at:</label>
              <input
                type="text"
                value={profile.createdAt}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
