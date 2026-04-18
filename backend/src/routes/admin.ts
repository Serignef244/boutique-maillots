import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { generateSlug } from '../utils/validation';

const router = Router();

router.post('/products', async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description, price, images, hasFlockage, sizes, team, season, isNew, isPromo, originalPrice } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({ error: 'Le nom est requis et doit faire au moins 3 caractères' });
    }

    if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({ error: 'Un prix valide et positif est requis' });
    }

    const slug = generateSlug(name);
    
    // Valeurs par défaut pour le tableau tailles s'il n'est pas envoyé ou vide
    const defaultSizes = ["S", "M", "L", "XL", "XXL"];
    const productSizes = Array.isArray(sizes) && sizes.length > 0 ? sizes : defaultSizes;

    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        description: description || '',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        images: Array.isArray(images) ? images : [],
        hasFlockage: typeof hasFlockage === 'boolean' ? hasFlockage : true,
        sizes: productSizes,
        team: team || null,
        season: season || null,
        isNew: typeof isNew === 'boolean' ? isNew : true,
        isPromo: typeof isPromo === 'boolean' ? isPromo : false
      }
    });

    return res.status(201).json({ success: true, product: newProduct });
    
  } catch (error: any) {
    console.error('Erreur POST /api/admin/products :', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Un produit avec ce nom ou slug existe déjà.' });
    }
    return res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});

// ROADMAP BONUS : Suppression
router.delete('/products/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    
    // Supprimer délicatement toutes les références de panier qui ont ce maillot
    await prisma.orderItem.deleteMany({
      where: { productId: id }
    });

    // Puis supprimer définitivement le maillot
    await prisma.product.delete({
      where: { id }
    });
    
    return res.json({ success: true });
  } catch (error: any) {
    console.error('Erreur DELETE /api/admin/products/:id :', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

export default router;
