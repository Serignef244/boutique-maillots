export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const generateSlug = (name: string): string => {
  return name
      .toString()
      .normalize('NFD') // Sépare les accents des lettres
      .replace(/[\u0300-\u036f]/g, '') // Retire les accents
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, '') // Enlève les caractères spéciaux
      .replace(/\s+/g, '-'); // Remplace les espaces par des tirets
};
