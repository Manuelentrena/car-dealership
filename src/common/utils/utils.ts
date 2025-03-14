// utils.js
import slugify from 'slugify';

export const generateSlug = (text: string) => {
  return slugify(text, {
    lower: true, // Convierte todo a minúsculas
    remove: /[*+~.()'"!:@]/g, // Elimina caracteres especiales
    replacement: '-', // Reemplaza los espacios por guiones
  });
};
