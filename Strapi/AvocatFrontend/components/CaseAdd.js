import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const AddCase = () => {
  const [Immatruclation, setImmatriculation] = useState('');
  const [client, setClient] = useState('');
  const [district, setDistrict] = useState(''); 
  const [clients, setClients] = useState([]);
  const [districts, setDistricts] = useState([]); 
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fonction pour récupérer le token depuis localStorage
  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/clients`, {
          headers: {
            Authorization: `Bearer ${getToken()}`, // Ajout du token
          },
        });
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data.data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchDistricts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/districts`, {
          headers: {
            Authorization: `Bearer ${getToken()}`, // Ajout du token
          },
        });
        if (!response.ok) throw new Error('Failed to fetch districts');
        const data = await response.json();
        setDistricts(data.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchClients();
    fetchDistricts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const caseData = {
      data: {
        Immatruclation: Immatruclation.trim(),
        client,
        district,
      },
    };

    if (!caseData.data.Immatruclation || !caseData.data.client || !caseData.data.district) {
      setError('Immatruclation, client, and district are required');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`, // Ajout du token
        },
        body: JSON.stringify(caseData),
      });

      if (!response.ok) throw new Error('Failed to add case');

      setImmatriculation('');
      setClient('');
      setDistrict('');
      alert('Case added successfully!');
      handleViewCases(client);

    } catch (error) {
      setError(error.message);
    }
  };

  const handleViewCases = (clientId) => {
    router.push(`/ClientCases/${clientId}`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add New Case</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="immatriculation" className="block text-sm font-medium mb-1">Immatriculation</label>
          <input
            type="text"
            id="immatriculation"
            value={Immatruclation}
            onChange={(e) => setImmatriculation(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="client" className="block text-sm font-medium mb-1">Client</label>
          <select
            id="client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Client</option>
            {clients.length > 0 ? (
              clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.attributes.FirstName} {client.attributes.LastName}
                </option>
              ))
            ) : (
              <option disabled>No clients available</option>
            )}
          </select>
        </div>
        <div>
          <label htmlFor="district" className="block text-sm font-medium mb-1">District</label>
          <select
            id="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select District</option>
            {districts.length > 0 ? (
              districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.attributes.Name}
                </option>
              ))
            ) : (
              <option disabled>No districts available</option>
            )}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Add Case
        </button>
      </form>
    </div>
  );
};

export default AddCase;
