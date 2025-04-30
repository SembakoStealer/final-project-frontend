import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UserProfile {
  username: string;
  email: string;
  bio: string;
  createdAt: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    email: '',
    bio: '',
    createdAt: '',
  });

  const [editMode, setEditMode] = useState({
    username: false,
    email: false,
    bio: false,
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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
          `${import.meta.env.VITE_API_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedDate = res.data.createdAt
          ? new Date(res.data.createdAt).toISOString().split('T')[0]
          : '';

        setProfile({
          username: res.data.username || '',
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setUpdating(true);
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/user`,
        {
          username: profile.username,
          email: profile.email,
          bio: profile.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditMode({ username: false, email: false, bio: false });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
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
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/catalog')}
          className="font-bold text-xl cursor-pointer hover:text-blue-600"
          style={{ cursor: 'pointer' }}
        >
          ← Back
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded cursor-pointer"
        >
          Logout
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
            {['name', 'email', 'bio'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-bold mb-2 capitalize">
                  {field}:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={profile[field as keyof UserProfile] || ''}
                    readOnly={!editMode[field as keyof typeof editMode]}
                    onChange={(e) =>
                      handleChange(field as keyof UserProfile, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                  />
                  <button
                    onClick={() =>
                      setEditMode((prev) => ({
                        ...prev,
                        [field]: !prev[field as keyof typeof editMode],
                      }))
                    }
                    className="text-gray-600 hover:text-blue-600 cursor-pointer"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            ))}
            <div>
              <label className="block text-sm font-bold mb-2">Created At:</label>
              <input
                type="text"
                value={profile.createdAt}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              />
            </div>
            <div className="text-right">
              <button
                onClick={handleSaveChanges}
                disabled={updating}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
