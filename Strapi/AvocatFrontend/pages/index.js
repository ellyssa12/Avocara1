import Navbar from '@/components/NavBar';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Import your authentication context

export default function Home() {
  const { isAuthenticated } = useAuth(); // Get the authentication state

  return (
    <div>
      <Head>
        <title>Votre Cabinet d Avocat - Justice et Expertise</title>
        <meta name="description" content="Cabinet d'avocats offrant des services juridiques professionnels et fiables." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar */}
      <Navbar />

      <section
        className="relative bg-cover bg-center h-screen flex flex-col justify-center items-center text-center"
        style={{ backgroundImage: "url('/original.jpg')" }}
      >
        {/* Overlay pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Votre Défenseur de Confiance
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Des services juridiques de premier ordre pour toutes vos affaires.
          </p>
          {/* Always display the Login button */}
          {!isAuthenticated && (
            <Link href="/login" passHref>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
