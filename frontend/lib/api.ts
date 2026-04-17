const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const getProducts = async () => {
    try {
        const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Erreur réseau');
        return await res.json();
    } catch (error) {
        console.error('getProducts error:', error);
        return [];
    }
};

export const getProduct = async (slug: string) => {
    try {
        const res = await fetch(`${API_URL}/products/${slug}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('getProduct error:', error);
        return null;
    }
};

export const createOrder = async (orderData: any) => {
    try {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('createOrder error:', error);
        return { error: 'Erreur lors de la création de la commande' };
    }
};

export const deleteProduct = async (id: string) => {
    try {
        const res = await fetch(`${API_URL}/admin/products/${id}`, {
            method: 'DELETE'
        });
        return await res.json();
    } catch (error) {
        return { error: 'Fails to delete' };
    }
}
