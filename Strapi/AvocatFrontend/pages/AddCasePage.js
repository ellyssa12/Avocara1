import AddCase from '@/components/CaseAdd';
import Navbar from '@/components/NavBar';
import Link from 'next/link';

const AddCasePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
    {/* Navbar */}
    <Navbar />

    {/* Main Content */}
    <main className="p-6">
      {/* ClientAdd Component */}
      <AddCase />

      {/* Back Button */}
      <div className="mt-4 text-center">
        <Link href="/about">
          <div className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Back
          </div>
        </Link>
      </div>
    </main>
  </div>
  );
};

export default AddCasePage;
