// pages/add-client.js

import ClientAdd from '@/components/ClientAdd';
import Navbar from '@/components/NavBar';
import Link from 'next/link';

const AddClientPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
    {/* Navbar */}
    <Navbar />

    {/* Main Content */}
    <main className="p-6">
      {/* ClientAdd Component */}
      <ClientAdd />

      {/* Back Button */}
      <div className="mt-4 text-center">
        
      </div>
    </main>
  </div>
);
};

export default AddClientPage;
