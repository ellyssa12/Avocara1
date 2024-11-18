import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaEye, FaFileInvoice, FaChevronLeft, FaBars } from 'react-icons/fa';
import Navbar from "@/components/NavBar";
import SideBar from "@/components/Sidebar";

const ClientCases = () => {
  const router = useRouter();
  const { id } = router.query;

  const [client, setClient] = useState(null);
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districts, setDistricts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 7;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddCase = () => {
    router.push('/AddCasePage');
  };

  const handleDeleteCase = async (caseId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/cases/${caseId}`, {
        method: 'DELETE',
        headers: {    
          Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete case');
      alert('Case deleted successfully!');
      setCases(cases.filter((caseItem) => caseItem.id !== caseId));
      setFilteredCases(filteredCases.filter((caseItem) => caseItem.id !== caseId));
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchClient = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/clients/${id}`);
        if (!response.ok) throw new Error('Failed to fetch client details');
        const data = await response.json();
        setClient(data.data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchCases = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/cases?filters[client][$eq]=${id}&populate=district`);
        if (!response.ok) throw new Error('Failed to fetch cases');
        const data = await response.json();
        setCases(data.data);
        setFilteredCases(data.data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchDistricts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/districts`);
        if (!response.ok) throw new Error('Failed to fetch districts');
        const data = await response.json();
        setDistricts(data.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchClient();
    fetchCases();
    fetchDistricts();
  }, [id]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredCases(
      cases.filter(
        (caseItem) =>
          caseItem.attributes.Immatruclation.toLowerCase().includes(query) &&
          (selectedDistrict === '' || (caseItem.attributes.district && caseItem.attributes.district.data.id === selectedDistrict))
      )
    );
    setCurrentPage(1);
  };

  const handleDistrictFilter = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setFilteredCases(
      cases.filter(
        (caseItem) => {
          const caseDistrict = String(caseItem.attributes.district?.data?.id);
          const districtIdStr = String(districtId);
          return (districtIdStr === '' || caseDistrict === districtIdStr) &&
                 caseItem.attributes.Immatruclation.toLowerCase().includes(searchQuery);
        }
      )
    );
    setCurrentPage(1);
  };

  const paginatedCases = filteredCases.slice((currentPage - 1) * casesPerPage, currentPage * casesPerPage);
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);

  return (
    <div className="flex min-h-screen">
      <SideBar isOpen={isSidebarOpen} />  {/* Sidebar */}

      <div className={`flex-1 bg-white transition-transform duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}>
        <Navbar />

        {/* Hamburger button to toggle sidebar */}
        <div
          onClick={toggleSidebar}
          className="fixed z-10 top-4 left-4 p-2 text-white rounded cursor-pointer"
        >
          <FaBars size={24} />
        </div>

        <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
          <button
            onClick={() => router.back()}
            className="mb-4 px-4 py-2 text-white bg-blue-500 rounded-md flex items-center"
          >
            <FaChevronLeft className="mr-2" />
            Back
          </button>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {client ? (
            <>
              <h1 className="text-2xl font-bold mb-4 text-center">
                Cases for Client: {client.attributes.FirstName} {client.attributes.LastName}
              </h1>
              <button
                onClick={handleAddCase}
                className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6 block mx-auto"
              >
                Add A New Case
              </button>

              <div className="flex items-center mb-4 space-x-4">
                <input
                  type="text"
                  placeholder="Search by Immatriculation"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                  value={selectedDistrict}
                  onChange={handleDistrictFilter}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">All Districts</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.attributes.Name}
                    </option>
                  ))}
                </select>
              </div>

              {paginatedCases.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immatriculation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoices</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedCases.map((caseItem) => (
                        <tr key={caseItem.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{caseItem.attributes.Immatruclation}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {caseItem.attributes.district ? caseItem.attributes.district.data.attributes.Name : 'District not assigned'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => router.push(`/Documents/${caseItem.id}`)}
                              className="text-blue-500 hover:underline"
                            >
                              <FaEye className="inline-block mr-1" />
                              View Documents
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => router.push(`/Invoice/${caseItem.id}`)}
                              className="text-blue-500 hover:underline"
                            >
                              <FaFileInvoice className="inline-block mr-1" />
                              View Invoices
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap space-x-4">
                            <button
                              onClick={() => router.push(`/EditCase/${caseItem.id}`)}
                              className="text-blue-500 hover:underline"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteCase(caseItem.id)}
                              className="text-red-500 hover:underline"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No cases found.</p>
              )}

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p>Loading client data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientCases;
