import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaSearch, FaEdit, FaTrashAlt } from 'react-icons/fa';
import Navbar from "@/components/NavBar";

const DocumentDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [documentsList, setDocumentsList] = useState([]);
  const [newDocument, setNewDocument] = useState({ Type: '', File: null });
  const [error, setError] = useState(null);
  const [editingDocumentId, setEditingDocumentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const documentsPerPage = 4; // 4 documents per page

  useEffect(() => {
    if (!id) return;
    fetchDocumentsList();
  }, [id]);

  const fetchDocumentsList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/documents?filters[case][$eq]=${id}&populate=File`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents list');
      }
      const data = await response.json();
      setDocumentsList(data.data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError(error.message);
    }
  };

  const handleAddOrUpdateDocument = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('data', JSON.stringify({ Type: newDocument.Type, case: id }));
    if (newDocument.File) {
      formData.append('files.File', newDocument.File);
    } else {
      setError('Please select a file to upload.');
      return;
    }

    try {
      const response = editingDocumentId
        ? await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/documents/${editingDocumentId}`, { method: 'PUT', body: formData })
        : await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/documents`, { method: 'POST', body: formData });

      if (!response.ok) {
        throw new Error(editingDocumentId ? 'Failed to update document' : 'Failed to add document');
      }

      fetchDocumentsList();
      setNewDocument({ Type: '', File: null });
      setEditingDocumentId(null);
    } catch (error) {
      console.error('Error occurred:', error);
      setError(error.message);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/documents/${documentId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
      fetchDocumentsList();
      alert('Document deleted successfully!');
    } catch (error) {
      console.error('Error deleting document:', error);
      setError(error.message);
    }
  };

  const handleEditDocument = (document) => {
    setNewDocument({ Type: document.attributes.Type, File: null });
    setEditingDocumentId(document.id);
  };

  const filteredDocuments = documentsList.filter(doc =>
    doc.attributes.Type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstDocument, indexOfLastDocument);
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
        <button
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 text-white bg-blue-500 rounded-md flex items-center"
        >
          <FaChevronLeft className="mr-2" />
          Back
        </button>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <h2 className="text-3xl font-semibold mt-6 mb-4 text-center">List of Documents</h2>
        
        <div className="mb-4 relative w-full">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Document Type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <form onSubmit={handleAddOrUpdateDocument} className="mb-6 flex space-x-4">
          <div className="flex-1">
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Document Type</label>
            <input
              id="documentType"
              type="text"
              placeholder="Enter Document Type"
              value={newDocument.Type}
              onChange={(e) => setNewDocument({ ...newDocument, Type: e.target.value })}
              className="mt-1 border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              required
            />
          </div>

          <div className="flex-1">
            <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">Upload File</label>
            <input
              id="fileUpload"
              type="file"
              onChange={(e) => setNewDocument({ ...newDocument, File: e.target.files[0] })}
              className="mt-1 border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              {editingDocumentId ? 'Update Document' : 'Add Document'}
            </button>
          </div>
        </form>

        {currentDocuments.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-4 text-left">Document Type</th>
                <th className="border border-gray-300 p-4 text-left">File</th>
                <th className="border border-gray-300 p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDocuments.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50 transition duration-200">
                  <td className="border border-gray-300 p-4">{doc.attributes.Type}</td>
                  <td className="border border-gray-300 p-4">
                    {doc.attributes.File && doc.attributes.File.length > 0 ? (
                      <a
                        href={`${process.env.NEXT_PUBLIC_STRAPI_URL}${doc.attributes.File[0].url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View File
                      </a>
                    ) : (
                      <span className="text-gray-500">No file</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-4 flex space-x-4">
                    <button onClick={() => handleEditDocument(doc)} className="text-blue-500">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteDocument(doc.id)} className="text-blue-500">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No documents found</p>
        )}

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;