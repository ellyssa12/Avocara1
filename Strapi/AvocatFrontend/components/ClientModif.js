import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaChevronLeft } from 'react-icons/fa';

const UpdateClient = ({ client }) => {
  const router = useRouter();
  const { id } = router.query;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);

  // Récupérer le token depuis le local storage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (client) {
      setFirstName(client.attributes.FirstName);
      setLastName(client.attributes.LastName);
      setPhone(client.attributes.Phone);
      setEmail(client.attributes.Email);
      setAddress(client.attributes.Address);
    }
  }, [client]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientData = {
      data: {
        FirstName: firstName,
        LastName: lastName,
        Phone: phone,
        Email: email,
        Address: address,
      },
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Ajouter le token ici
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update client');
      }

      alert('Client updated successfully!');
      router.push('/about'); // Redirige vers la page d'accueil ou une autre page de votre choix
    } catch (error) {
      setError(error.message);
    }
  };

  if (!client) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      {/* Bouton pour revenir en arrière */}
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 text-white bg-blue-500 rounded-md flex items-center"
      >
        <FaChevronLeft className="mr-2" />
        Back
      </button>
      
      <h1 className="text-2xl font-bold mb-4">Update Client</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Update Client
        </button>
      </form>
    </div>
  );
};

export default UpdateClient;
