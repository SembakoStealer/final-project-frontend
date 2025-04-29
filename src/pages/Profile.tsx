// src/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
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
    createdAt: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get<UserProfile>(
          `${import.meta.env.VITE_API_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedDate = new Date(res.data.createdAt).toISOString().split('T')[0];

        setProfile({
          name: res.data.name || '',
          email: res.data.email || '',
          bio: res.data.bio || '',
          createdAt: formattedDate,
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

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
        <button onClick={() => navigate('/home')} className="font-bold text-xl">
          Back
        </button>
      </div>

      {/* Profile Card */}
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-200"></div>
          </div>

          {/* Profile Fields */}
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
              <label className="block text-sm font-bold mb-2">Created At:</label>
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
