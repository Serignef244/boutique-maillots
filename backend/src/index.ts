import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import adminRouter from './routes/admin';
import { initializeWhatsApp } from './services/whatsapp';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuré pour accepter les requêtes de Vercel
app.use(cors({
  origin: '*' // Permet à n'importe quel domaine de se connecter
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Point d'entrée pour vérifier la santé du serveur
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes de l'application
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

// Middleware d'erreur global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erreur interceptée par le middleware global:', err.stack);
  res.status(500).json({ error: 'Une erreur interne est survenue.' });
});

// Démarrage du serveur et initialisation WhatsApp
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
  
  // Démarrer la connexion WhatsApp Web (Désactivé car géré côté client HTTP Link)
  // initializeWhatsApp();
});
