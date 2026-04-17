import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(products);
  } catch (error) {
    console.error('Erreur GET /api/products :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req: Request, res: Response): Promise<any> => {
  try {
    const { slug } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { slug }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Erreur GET /api/products/:slug :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
});

export default router;
