import UpdateClient from '@/components/ClientModif';
import Navbar from '@/components/NavBar';

const UpdateClientPage = ({ client, error }) => {
  if (error) return <p className="text-red-500">Failed to fetch client: {error}</p>;
  if (!client) return <p>Loading...</p>;

  return (
    <div>
         <Navbar />
    <div className="p-6">
    {/* Barre de navigation ajoutée ici */}
      <UpdateClient client={client} />
    </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.query;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/clients/${id}`);
    if (!response.ok) {
      throw new Error('Client not found');
    }
    const data = await response.json();
    return { props: { client: data.data } };
  } catch (error) {
    return { props: { client: null, error: error.message } };
  }
}

export default UpdateClientPage;
