import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import Navbar from '@/components/NavBar';

const Profile = () => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    username: '',
    email: '',
    FirstName: '',
    PhoneNumber: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found, user might not be logged in');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching user:', errorData);
          return;
        }

        const data = await response.json();
        setUser(data);
        setUpdatedUser(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating profile:', errorData);
        return;
      }

      const data = await response.json();
      setUser(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Fetch error while saving profile:', error);
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error deleting account:', errorData);
          alert('Failed to delete account');
          return;
        }

        alert('Account deleted successfully');
      } catch (error) {
        console.error('Fetch error while deleting account:', error);
        alert('An error occurred while deleting your account');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">User Profile</h1>
          <div className="space-y-4">
            {['username', 'email', 'FirstName', 'PhoneNumber'].map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block text-gray-700 text-sm">{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={isEditing ? updatedUser[field] : user[field] || ''}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full p-3 rounded-md border ${isEditing ? 'border-blue-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="bg-blue-500 text-white p-3 rounded-md hover:bg-green-600 transition-all"
                  title="Save"
                >
                  <FaSave />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 transition-all"
                  title="Cancel"
                >
                  <FaTrash />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditProfile}
                  className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-all"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={handleDeleteProfile}
                  className="bg-gray-500 text-white p-3 rounded-md hover:bg-red-600 transition-all"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;