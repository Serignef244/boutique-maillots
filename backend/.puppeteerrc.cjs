const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Force le téléchargement de Google Chrome à rester dans le dossier du projet.
  // Cela empêche Render de le supprimer entre la phase de Build et de Démarrage.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
