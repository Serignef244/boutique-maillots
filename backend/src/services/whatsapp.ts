import mongoose from 'mongoose';
import { Client, LocalAuth, RemoteAuth } from 'whatsapp-web.js';
import puppeteer from 'puppeteer';
import qrcode from 'qrcode-terminal';
import { MongoStore } from 'wwebjs-mongo';

let client: Client;

export const initializeWhatsApp = async () => {
    try {
        console.log('Initialisation du client WhatsApp...');

        // Si une URL MongoDB est définie, on utilise RemoteAuth pour sauvegarder la session en BDD (IDÉAL POUR RENDER/HEROKU)
        const mongoUri = process.env.MONGODB_URI;

        if (mongoUri) {
            console.log('🔗 Connexion à MongoDB pour RemoteAuth...');
            await mongoose.connect(mongoUri);
            const store = new MongoStore({ mongoose: mongoose });

            client = new Client({
                authStrategy: new RemoteAuth({
                    store: store,
                    backupSyncIntervalMs: 300000
                }),
                puppeteer: {
                    executablePath: puppeteer.executablePath(),
                    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Requis par Render/Linux cloud
                }
            });

            client.on('remote_session_saved', () => {
                console.log('💾 Session WhatsApp sauvegardée de manière asynchrone dans MongoDB.');
            });

        } else {
            console.log('💻 Utilisation de LocalAuth (Sauvegarde locale persistante)');
            client = new Client({
                authStrategy: new LocalAuth(),
                puppeteer: {
                    executablePath: puppeteer.executablePath(),
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                }
            });
        }

        client.on('qr', (qr: string) => {
            console.log('\n======================================================');
            console.log('📱 VEUILLEZ SCANNER LE QR CODE CI-DESSOUS AVEC WHATSAPP');
            console.log('======================================================\n');
            qrcode.generate(qr, { small: true });
        });

        client.on('ready', () => {
            console.log('✅ Client WhatsApp prêt et connecté !');
        });

        client.on('disconnected', (reason: any) => {
            console.log('❌ Client WhatsApp déconnecté. Raison :', reason);
        });

        client.initialize();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de WhatsApp :', error);
    }
};

export const sendWhatsAppOrder = async (order: any): Promise<void> => {
    try {
        if (!client) {
            console.error('Client WhatsApp non initialisé');
            return;
        }

        const targetNumber = process.env.WHATSAPP_NUMBER || '';
        if (!targetNumber) return;

        const chatId = `${targetNumber}@c.us`;

        let message = `🛒 *NOUVELLE COMMANDE: ${order.orderNumber}* 🛒\n\n`;
        message += `👤 *Client :* ${order.customerName}\n`;
        message += `📞 *Téléphone :* ${order.customerPhone}\n`;
        if (order.customerEmail) message += `📧 *Email :* ${order.customerEmail}\n`;
        
        message += `\n📦 *Détails des articles :*\n`;

        order.items.forEach((item: any, index: number) => {
            message += `${index + 1}. *${item.productName}*\n`;
            message += `   - Taille : ${item.size} | Qté : ${item.quantity}\n`;
            if (item.hasFlockage && item.flockageText) {
                message += `   - Flocage : "${item.flockageText}"\n`;
            }
            message += `   - S/Total : ${item.price * item.quantity} FCFA\n\n`;
        });

        message += `💰 *TOTAL A RECOUVRER : ${order.total} FCFA*`;

        await client.sendMessage(chatId, message);
        console.log(`✅ Message WhatsApp envoyé pour la commande ${order.orderNumber}`);

    } catch (error) {
        console.error('Erreur WhatsApp send:', error);
    }
};
