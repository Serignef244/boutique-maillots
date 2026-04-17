import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { sendWhatsAppOrder } from '../services/whatsapp';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { customerName, customerPhone, customerEmail, items } = req.body;

    // Validation basique
    if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Nom, téléphone et articles au minimum sont requis' });
    }

    // Génération du numéro de commande unique (ex: CMD-1678901234)
    const orderNumber = `CMD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    let total = 0;
    const itemsToCreate = [];

    // Vérifier les prix des produits depuis la base pour sécuriser le montant total final
    for (const item of items) {
       const product = await prisma.product.findUnique({ where: { id: item.productId } });
       
       if (!product) {
          return res.status(400).json({ error: `Le produit avec l'ID ${item.productId} est introuvable` });
       }

       // Calcul total avec le prix réel en base
       total += product.price * item.quantity;

       itemsToCreate.push({
           productId: product.id,
           productName: product.name,
           quantity: item.quantity,
           size: item.size || 'M',
           hasFlockage: item.hasFlockage || false,
           flockageText: item.flockageText || null,
           price: product.price
       });
    }

    // Sauvegarde en base (Order + OrderItems)
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        total,
        items: {
          create: itemsToCreate
        }
      },
      include: {
        items: true
      }
    });

    // Envoi du récapitulatif sur WhatsApp de manière asynchrone sans bloquer la requête
    sendWhatsAppOrder(order).catch(error => {
      console.error('Échec de la notification WhatsApp silencieux:', error);
    });

    return res.status(201).json({ success: true, orderNumber });
    
  } catch (error) {
    console.error('Erreur lors de la création de la commande :', error);
    return res.status(500).json({ error: 'Erreur interne lors de la création de la commande' });
  }
});

export default router;
