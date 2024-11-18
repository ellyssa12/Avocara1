import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import React from 'react';
import { FaUser, FaSignOutAlt, FaHome } from 'react-icons/fa';

const SideBar = ({ isOpen }) => {
  const { logoutUser } = useAuth(); // Récupère la fonction de déconnexion

  const handleLogout = (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du lien
    logoutUser(); // Appelle la fonction de déconnexion
    window.location.href = '/login'; // Redirige vers la page de connexion
  };
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } w-80`} // Augmenter la largeur ici
    >
      {/* Welcome Section */}
      <div className="p-6 text-center border-b border-gray-700">
        <p className="text-lg font-semibold">Avocara</p>
      </div>

      {/* Navigation Links */}
      <div className="p-6 text-center border-b border-gray-700">
        <p className="text-lg font-semibold">Welcome</p>
      </div>
      <nav className="flex flex-col mt-4">
        <Link href="/profile" className="flex items-center p-4 hover:bg-gray-700 transition">
          <FaUser className="mr-3" /> Profile
        </Link>
        <Link href="/about" className="flex items-center p-4 hover:bg-gray-700 transition">
          <FaHome className="mr-3" /> Home
        </Link>
        <a href="/logout" onClick={handleLogout} className="flex items-center p-4 hover:bg-gray-700 transition">
          <FaSignOutAlt className="mr-3" /> Logout
        </a>
      </nav>
    </div>
  );
};

export default SideBar;
