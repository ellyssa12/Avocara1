import Clients from "@/components/Clients";
import Navbar from "@/components/NavBar";
import SideBar from "@/components/Sidebar";
import { fetcher } from "@/lib/api";
import { useState } from 'react';
import { FaBars } from 'react-icons/fa'; 

const About = ({ clients }) => {
  const [isOpen, setIsOpen] = useState(false); // État pour la visibilité de la sidebar

  // Fonction pour basculer l'état de la sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar positionnée sous le Navbar */}
      <SideBar isOpen={isOpen} />

      {/* Main content area */}
      <div
        className={`flex-1 bg-white transition-transform duration-300 ${
          isOpen ? 'ml-80' : 'ml-0' // Décaler le contenu principal vers la droite
        }`}
      >
        <Navbar />
        
        {/* Bouton hamburger pour ouvrir/fermer la sidebar */}
        <div
          onClick={toggleSidebar} // Bascule la sidebar sur clic
          className="fixed z-10 top-4 left-4 p-2 text-white rounded cursor-pointer"
        >
          <FaBars size={24} /> {/* Afficher l'icône hamburger */}
        </div>

        <div className="p-6">
          <Clients clients={clients} />
        </div>
      </div>
    </div>
  );
};

export default About;

export async function getStaticProps() {
  try {
    const response = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/clients`
    );
    const clients = response.data;

    console.log(clients);
    return {
      props: { clients },
    };
  } catch (error) {
    console.error("Error fetching clients:", error);

    return {
      props: { clients: [] },
    };
  }
}
