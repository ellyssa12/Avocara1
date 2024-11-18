import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from "@/components/NavBar";
import SideBar from "@/components/Sidebar"; // Assurez-vous que Sidebar est importé
import { FaBars, FaChevronLeft } from 'react-icons/fa'; // Importer l'icône pour le bouton de la sidebar

const CaseModifier = () => {
  const router = useRouter();
  const { id } = router.query; // ID du cas à modifier
  const [caseDetails, setCaseDetails] = useState(null);
  const [districts, setDistricts] = useState([]); // État pour les districts
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // État de chargement
  const [isOpen, setIsOpen] = useState(false); // État pour contrôler l'ouverture de la sidebar

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  console.log("Token:", token);

  // Récupérer les détails du cas et la liste des districts
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        console.log(`Fetching case details for ID: ${id}`);
        const caseResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/cases/${id}?populate=district`);
        if (!caseResponse.ok) {
          throw new Error('Failed to fetch case details');
        }
        const caseData = await caseResponse.json();
        console.log('Case details fetched:', caseData);
        setCaseDetails(caseData.data); // Ajustez la structure si nécessaire

        console.log('Fetching districts');
        const districtResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/districts`);
        if (!districtResponse.ok) {
          throw new Error('Failed to fetch districts');
        }
        const districtData = await districtResponse.json();
        console.log('Districts fetched:', districtData);
        setDistricts(districtData.data); // Ajustez la structure si nécessaire

      } catch (error) {
        console.error('Error:', error.message);
        setError(error.message);
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchData();
  }, [id]);

  // Mettre à jour le cas
  const handleUpdateCase = async (e) => {
    e.preventDefault();
    const updatedCase = {
      data: {
        Immatruclation: e.target.Immatruclation.value,
        district: e.target.district.value, // Nouveau champ pour le district
      },
    };

    try {
      console.log('Updating case:', updatedCase);
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/cases/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCase),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update case');
      }

      alert('Case updated successfully!');
      router.back(); // Redirection vers la page des cas du client
    } catch (error) {
      console.error('Error updating case:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Affichage pendant le chargement
  if (loading) return <p className="text-center">Loading case details...</p>;

  return (
    <div className="bg-gray-50 min-h-screen flex relative">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white transition-transform duration-300 ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <SideBar isOpen={isOpen} />
      </div>
  
      {/* Overlay for sidebar */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)}></div>}
  
      {/* Main content area */}
      <div className="flex-1 bg-white ml-0 transition-all duration-300">
        <Navbar />

        {/* Icône hamburger pour afficher la sidebar */}
        <div
          onMouseEnter={() => setIsOpen(true)} // Afficher la sidebar au survol
          onMouseLeave={() => setIsOpen(false)} // Cacher la sidebar au survol
          className="fixed z-10 top-4 left-4 p-2 text-white rounded cursor-pointer"
        >
          <FaBars size={24} /> {/* Afficher l'icône hamburger */}
        </div>

        <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
               {/* Button to go back to the previous page */}
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 text-white bg-blue-500 rounded-md flex items-center"
      >
        <FaChevronLeft className="mr-2" />
        Back
      </button>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {caseDetails ? (
            <>
              <h1 className="text-2xl font-bold mb-4 text-center">Modifier le Cas</h1>
              <form onSubmit={handleUpdateCase}>
                <div className="mb-4">
                  <label className="block text-gray-700">Immatruclation</label>
                  <input
                    type="text"
                    name="Immatruclation"
                    defaultValue={caseDetails.attributes.Immatruclation}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="district" className="block text-gray-700">District</label>
                  <select
                    id="district"
                    name="district"
                    defaultValue={caseDetails.attributes.district ? caseDetails.attributes.district.data.id : ''} // Pré-sélectionner le district actuel
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select District</option>
                    {districts.length > 0 ? (
                      districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.attributes.Name} {/* Change this according to your district structure */}
                        </option>
                      ))
                    ) : (
                      <option disabled>No districts available</option>
                    )}
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Mettre à jour
                </button>
              </form>
            </>
          ) : (
            <p className="text-center text-gray-500">Aucun détail trouvé pour ce cas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseModifier;
