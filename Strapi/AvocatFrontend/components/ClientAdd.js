// components/AddClient.js

import { useRouter } from 'next/router';
import { useState } from 'react';

const ClientAdd = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();  // Définir router ici

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token'); // Correction ici
  
    const clientData = {
      data: {
        FirstName: firstName,
        LastName: lastName,
        Phone: phone,
        Email: email,
        Address: address, // Champ Address
      },
    };
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Assurez-vous d'inclure ceci
          Authorization: `Bearer ${token}`, // Ajoutez le token ici
        },
        body: JSON.stringify(clientData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add client');
      }
  
      // Réinitialisation des champs
      setFirstName('');
      setLastName('');
      setPhone('');
      setEmail('');
      setAddress('');
      alert('Client added successfully!');
      router.push('/about');
    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 text-white bg-blue-500 rounded-md flex items-center"
      ></button>
      <h1 className="text-2xl font-bold mb-4">Add New Client</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
          Add Client
        </button>
      </form>
    </div>
  );
};

export default ClientAdd;
