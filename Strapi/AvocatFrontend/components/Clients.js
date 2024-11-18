import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa'; // Importing icons

const Clients = ({ clients }) => {
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 3;
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // Récupérer le token JWT depuis le localStorage ou un autre endroit où il est stocké
    const storedToken = localStorage.getItem('token'); // Assurez-vous que le token est stocké avec la clé 'token'
    setToken(storedToken);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredClients = clients.filter((client) => {
    return (
      client.attributes.FirstName.toLowerCase().includes(searchQuery) ||
      client.attributes.LastName.toLowerCase().includes(searchQuery) ||
      client.attributes.Phone.includes(searchQuery) ||
      client.attributes.Email.toLowerCase().includes(searchQuery) ||
      client.attributes.Address.toLowerCase().includes(searchQuery)
    );
  });

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const handleAddClient = () => {
    router.push('/AddClientPage');
  };

  const handleViewCases = (clientId) => {
    router.push(`/ClientCases/${clientId}`);
  };

  const handleDeleteClient = async (clientId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/clients/${clientId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}` // Utilisez le token JWT dans l'en-tête
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete client');
      }

      alert('Client deleted successfully!');
      router.replace(router.asPath);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white border border-gray-300 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">List Of Clients</h1>
      <button
        onClick={handleAddClient}
        className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6 block mx-auto"
      >
        Add A New Client
      </button>

      {/* Elegant Search Bar */}
      <div className="mb-6 relative max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search clients by name, phone, email, or address"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
          <FaSearch />
        </div>
      </div>

      <div className="overflow-auto max-w-full">
        {filteredClients.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-sm font-semibold text-gray-600">First Name</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-sm font-semibold text-gray-600">Last Name</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-sm font-semibold text-gray-600">Phone</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-sm font-semibold text-gray-600">Email</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-sm font-semibold text-gray-600">Address</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-sm font-semibold text-gray-600">Update</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-sm font-semibold text-gray-600">Delete</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-sm font-semibold text-gray-600">View Cases</th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-100">
                  <td className="px-5 py-4 text-center border-b border-gray-200">{client.attributes.FirstName}</td>
                  <td className="px-5 py-4 text-center border-b border-gray-200">{client.attributes.LastName}</td>
                  <td className="px-5 py-4 text-center border-b border-gray-200">{client.attributes.Phone}</td>
                  <td className="px-5 py-4 text-center border-b border-gray-200">{client.attributes.Email}</td>
                  <td className="px-5 py-4 text-center border-b border-gray-200">{client.attributes.Address}</td>
                  <td className="px-5 py-4 text-center border-b border-gray-200">
                    <Link href={`/ModifierClient/${client.id}`}>
                      <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600">
                        <FaEdit />
                      </button>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-center border-b border-gray-200">
                    <button onClick={() => handleDeleteClient(client.id)} className="bg-blue-500 text-white rounded-full p-2 hover:bg-red-600">
                      <FaTrash />
                    </button>
                  </td>
                  <td className="px-5 py-4 text-center border-b border-gray-200">
                    <button onClick={() => handleViewCases(client.id)} className="bg-blue-500 text-white rounded-full p-2 hover:bg-green-600">
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No clients found.</p>
        )}
      </div>
      
      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Clients;
