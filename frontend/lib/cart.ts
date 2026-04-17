export const FLOCKAGE_PRICE = 2000;

export const dispatchCartUpdated = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart-updated'));
    }
};
