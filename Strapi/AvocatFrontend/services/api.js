// services/api.js
export const login = async (identifier, password) => {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local`;
    console.log('Logging in to:', url); // Ajoutez cette ligne
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
    });

    if (!response.ok) throw new Error('Failed to log in');
    
    return await response.json();
};
