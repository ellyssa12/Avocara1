import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // Importez le contexte d'authentification

const Navbar = () => {
  const { isAuthenticated, logoutUser } = useAuth(); // Récupérez l'état d'authentification et la fonction de déconnexion
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du lien
    logoutUser(); // Appelle la fonction de déconnexion
    window.location.href = '/login'; // Redirige vers la page de connexion
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md"> {/* Couleur sombre */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex space-x-4">
              <Link href="/" className="text-white text-lg font-semibold">
                Avocara
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
            {/* Liens visibles uniquement si l'utilisateur est authentifié */}
            {isAuthenticated ? (
              <>
                <Link href="/about" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Clients
                </Link>
                <Link href="/districts" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Districts
                </Link>
            
                <Link href="/login" onClick={handleLogout} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Logout
                </Link>
              </>
            ) : (
              <div className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {/* Liens mobiles visibles uniquement si l'utilisateur est authentifié */}
          {isAuthenticated ? (
            <>
              <Link href="/about" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Clients
              </Link>
              <Link href="/districts" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Districts
              </Link>
          
              <Link href="/login" onClick={handleLogout} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-sm font-medium">
                Logout
              </Link>
            </>
          ) : (
            <div className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-sm font-medium">
              
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
