import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Importer useRouter pour la redirection
import { FaEdit, FaTrash, FaBars } from 'react-icons/fa';
import Navbar from "@/components/NavBar";
import SideBar from "@/components/Sidebar"; 
import { useAuth } from '../context/AuthContext'; // Importer le contexte d'authentification

const DistrictsPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // Récupérer l'état d'authentification
  const [districtName, setDistrictName] = useState('');
  const [districts, setDistricts] = useState([]);
  const [error, setError] = useState(null);
  const [editingDistrictId, setEditingDistrictId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Vérifier l'authentification et rediriger si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Rediriger vers la page de connexion
    }
  }, [isAuthenticated, router]);

  const fetchDistricts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/districts`);
      if (!response.ok) {
        throw new Error('Failed to fetch districts');
      }
      const data = await response.json();
      setDistricts(data.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  const handleAddOrUpdateDistrict = async (e) => {
    e.preventDefault();
    const newDistrict = {
      data: {
        Name: districtName.trim(),
      },
    };
    if (!newDistrict.data.Name) {
      setError('District name is required');
      return;
    }
    try {
      const response = editingDistrictId
        ? await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/districts/${editingDistrictId}`, {
            method: 'PUT',
                headers: {
        Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(newDistrict),
          })
        : await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/districts`, {
            method: 'POST',
                headers: {
        Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(newDistrict),
          });

      if (!response.ok) {
        throw new Error(`Failed to ${editingDistrictId ? 'update' : 'add'} district`);
      }

      setDistrictName('');
      setEditingDistrictId(null);
      await fetchDistricts();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditDistrict = (district) => {
    setDistrictName(district.attributes.Name);
    setEditingDistrictId(district.id);
  };

  const handleDeleteDistrict = async (districtId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/districts/${districtId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete district');
      }
      await fetchDistricts();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <div className={`transition-transform duration-300 ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <SideBar isOpen={isOpen} />
      </div>
      <div className="flex-1 bg-white">
        <Navbar />
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="fixed z-10 top-4 left-4 p-2 text-white rounded cursor-pointer"
        >
          <FaBars size={24} />
        </div>
        <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center text-black-600">Districts</h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleAddOrUpdateDistrict} className="mb-6 flex justify-between">
            <input
              type="text"
              id="district"
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
              required
              placeholder="Enter District Name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded ml-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {editingDistrictId ? 'Update District' : 'Add District'}
            </button>
          </form>
          {districts.length > 0 ? (
            <ul className="space-y-2">
              {districts.map((district) => (
                <li key={district.id} className="bg-gray-100 p-4 border border-black-300 rounded-lg shadow-sm flex justify-between items-center">
                  <span className="text-lg font-semibold">{district.attributes.Name}</span>
                  <div className="flex">
                    <button
                      onClick={() => handleEditDistrict(district)}
                      className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition duration-200 mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteDistrict(district.id)}
                      className="bg-blue-500 text-white rounded-full p-2 hover:bg-black-600 transition duration-200"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No districts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistrictsPage;
