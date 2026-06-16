// server/scripts/seed.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Import des modèles
const User = require('../models/User');
const Service = require('../models/Service');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Transaction = require('../models/Transaction');

// Données de test
const seedData = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connecté à MongoDB');

        // ========== SUPPRIMER LES ANCIENNES DONNÉES ==========
        console.log('🗑️ Suppression des anciennes données...');
        await User.deleteMany({});
        await Service.deleteMany({});
        await Order.deleteMany({});
        await Review.deleteMany({});
        await Transaction.deleteMany({});
        console.log('✅ Anciennes données supprimées');

        // ========== CRÉATION DES UTILISATEURS ==========
        console.log('👥 Création des utilisateurs...');

        // Admin
        const admin = await User.create({
            name: 'Admin Hirafi',
            email: 'admin@hirafi.com',
            password: 'admin123',
            role: 'admin',
            isVerified: true,
            isActive: true,
            balance: 0,
            city: 'Casablanca',
            phone: '0522223344'
        });

        // Clients
        const client1 = await User.create({
            name: 'Ahmed Benjelloun',
            email: 'ahmed@example.com',
            password: '12345678',
            role: 'client',
            isVerified: true,
            isActive: true,
            balance: 1500,
            city: 'Casablanca',
            phone: '0612345678',
            bio: 'Entrepreneur passionné par le digital'
        });

        const client2 = await User.create({
            name: 'Fatima Zahra',
            email: 'fatima@example.com',
            password: '12345678',
            role: 'client',
            isVerified: true,
            isActive: true,
            balance: 800,
            city: 'Rabat',
            phone: '0687654321',
            bio: 'Fondatrice d\'une startup e-commerce'
        });

        // Freelancers
        const freelancer1 = await User.create({
            name: 'Yassine Benali',
            email: 'yassine@example.com',
            password: '12345678',
            role: 'freelancer',
            isVerified: true,
            isActive: true,
            balance: 2500,
            city: 'Casablanca',
            phone: '0612345699',
            bio: 'Designer graphique spécialisé en identité visuelle marocaine',
            skills: ['UI/UX Design', 'Logo Design', 'Branding', 'Figma', 'Photoshop'],
            hourlyRate: 150,
            rating: 4.9,
            ratingCount: 128
        });

        const freelancer2 = await User.create({
            name: 'Sara Alami',
            email: 'sara@example.com',
            password: '12345678',
            role: 'freelancer',
            isVerified: true,
            isActive: true,
            balance: 1800,
            city: 'Rabat',
            phone: '0612345600',
            bio: 'Développeuse web full-stack, créatrice de sites e-commerce',
            skills: ['React.js', 'Node.js', 'Laravel', 'MongoDB', 'Tailwind'],
            hourlyRate: 200,
            rating: 4.8,
            ratingCount: 94
        });

        const freelancer3 = await User.create({
            name: 'Karim Mansouri',
            email: 'karim@example.com',
            password: '12345678',
            role: 'freelancer',
            isVerified: true,
            isActive: true,
            balance: 1200,
            city: 'Marrakech',
            phone: '0687654322',
            bio: 'Expert en marketing digital et réseaux sociaux',
            skills: ['SEO', 'Social Media', 'Google Ads', 'Content Strategy'],
            hourlyRate: 120,
            rating: 4.7,
            ratingCount: 72
        });

        const freelancer4 = await User.create({
            name: 'Nadia Tazi',
            email: 'nadia@example.com',
            password: '12345678',
            role: 'freelancer',
            isVerified: true,
            isActive: true,
            balance: 900,
            city: 'Fès',
            phone: '0678912345',
            bio: 'Calligraphe et artiste digitale, fusion entre tradition et modernité',
            skills: ['Calligraphie Arabe', 'Illustration', 'Lettering', 'Photoshop'],
            hourlyRate: 100,
            rating: 5.0,
            ratingCount: 45
        });

        console.log('✅ Utilisateurs créés');

        // ========== CRÉATION DES SERVICES ==========
        console.log('📦 Création des services...');

        const services = await Service.create([
            {
                title: 'Création d\'identité visuelle marocaine authentique',
                description: 'Je conçois une identité visuelle complète qui reflète l\'authenticité et le savoir-faire marocain. Logo, palette de couleurs, typographie et charte graphique.',
                category: 'graphic-design',
                subcategory: 'logo-design',
                price: 350,
                deliveryDays: 5,
                tags: ['Logo', 'Branding', 'Design', 'Marocain'],
                images: ['https://placehold.co/600x400/3D5A3E/white?text=Logo+Design'],
                requirements: 'Veuillez fournir une description détaillée de votre projet, votre secteur d\'activité et vos inspirations.',
                freelancerId: freelancer1._id,
                rating: 4.9,
                ratingCount: 128,
                views: 450,
                orders: 35,
                status: 'active'
            },
            {
                title: 'Développement site web React.js responsive',
                description: 'Création de sites web modernes, rapides et responsives avec React.js et Tailwind CSS. Performance optimisée et expérience utilisateur fluide.',
                category: 'web-development',
                subcategory: 'frontend',
                price: 800,
                deliveryDays: 10,
                tags: ['React', 'Frontend', 'Website', 'Tailwind'],
                images: ['https://placehold.co/600x400/3D5A3E/white?text=Web+Dev'],
                requirements: 'Fournissez les maquettes (Figma/XD) et les spécifications techniques de votre projet.',
                freelancerId: freelancer2._id,
                rating: 4.8,
                ratingCount: 94,
                views: 320,
                orders: 28,
                status: 'active'
            },
            {
                title: 'Stratégie de marketing digital complète',
                description: 'Élaboration d\'une stratégie marketing sur mesure pour votre entreprise : SEO, réseaux sociaux, publicités et analyse de données.',
                category: 'marketing',
                subcategory: 'social-media',
                price: 500,
                deliveryDays: 7,
                tags: ['Marketing', 'SEO', 'Social Media', 'Ads'],
                images: ['https://placehold.co/600x400/3D5A3E/white?text=Marketing'],
                requirements: 'Partagez votre objectif marketing, votre budget et votre public cible.',
                freelancerId: freelancer3._id,
                rating: 4.7,
                ratingCount: 72,
                views: 280,
                orders: 22,
                status: 'active'
            },
            {
                title: 'Calligraphie arabe sur mesure',
                description: 'Création d\'œuvres calligraphiques personnalisées. Mariage entre tradition et modernité. Parfait pour logos, affiches ou art mural.',
                category: 'graphic-design',
                subcategory: 'illustration',
                price: 250,
                deliveryDays: 4,
                tags: ['Calligraphie', 'Art', 'Arabe', 'Tradition'],
                images: ['https://placehold.co/600x400/3D5A3E/white?text=Calligraphie'],
                requirements: 'Envoyez le texte à calligraphier et vos préférences de style.',
                freelancerId: freelancer4._id,
                rating: 5.0,
                ratingCount: 45,
                views: 200,
                orders: 18,
                status: 'active'
            },
            {
                title: 'Application mobile React Native',
                description: 'Développement d\'applications mobiles cross-platform avec React Native. Code de qualité, UI fluide et performance optimale.',
                category: 'web-development',
                subcategory: 'mobile',
                price: 1500,
                deliveryDays: 15,
                tags: ['React Native', 'Mobile', 'iOS', 'Android'],
                images: ['https://placehold.co/600x400/3D5A3E/white?text=Mobile+App'],
                requirements: 'Fournissez les maquettes UI/UX et les fonctionnalités souhaitées.',
                freelancerId: freelancer2._id,
                rating: 4.9,
                ratingCount: 67,
                views: 350,
                orders: 15,
                status: 'active'
            }
        ]);

        console.log('✅ Services créés');

        // ========== CRÉATION DES COMMANDES ==========
        console.log('📝 Création des commandes...');

        const orders = await Order.create([
            {
                orderNumber: 'HIR-2025-0001',
                serviceId: services[0]._id,
                clientId: client1._id,
                freelancerId: freelancer1._id,
                requirements: 'Je veux un logo pour ma startup de e-commerce. Style moderne avec une touche marocaine.',
                price: 350,
                platformFee: 35,
                freelancerEarnings: 315,
                status: 'completed',
                completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                deliveryMessage: 'Voici votre logo. J\'espère qu\'il vous plaira !',
                deliveryFile: 'https://example.com/logo.zip'
            },
            {
                orderNumber: 'HIR-2025-0002',
                serviceId: services[1]._id,
                clientId: client2._id,
                freelancerId: freelancer2._id,
                requirements: 'Site vitrine pour mon association culturelle. Besoin d\'un design épuré et responsive.',
                price: 800,
                platformFee: 80,
                freelancerEarnings: 720,
                status: 'in-progress',
                deliveredAt: null
            },
            {
                orderNumber: 'HIR-2025-0003',
                serviceId: services[2]._id,
                clientId: client1._id,
                freelancerId: freelancer3._id,
                requirements: 'Stratégie marketing pour lancer mon nouveau produit.',
                price: 500,
                platformFee: 50,
                freelancerEarnings: 450,
                status: 'pending'
            },
            {
                orderNumber: 'HIR-2025-0004',
                serviceId: services[3]._id,
                clientId: client2._id,
                freelancerId: freelancer4._id,
                requirements: 'Calligraphie du nom de mon entreprise pour le logo.',
                price: 250,
                platformFee: 25,
                freelancerEarnings: 225,
                status: 'delivered',
                deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
        ]);

        console.log('✅ Commandes créées');

        // ========== CRÉATION DES REVIEWS ==========
        console.log('⭐ Création des avis...');

        await Review.create([
            {
                orderId: orders[0]._id,
                serviceId: services[0]._id,
                clientId: client1._id,
                freelancerId: freelancer1._id,
                rating: 5,
                comment: 'Excellent travail ! Yassine a parfaitement compris mon besoin. Le logo est magnifique et correspond exactement à ce que je voulais. Je recommande vivement !',
                status: 'active'
            },
            {
                orderId: orders[3]._id,
                serviceId: services[3]._id,
                clientId: client2._id,
                freelancerId: freelancer4._id,
                rating: 5,
                comment: 'Un vrai talent ! La calligraphie est sublime, un mélange parfait entre tradition et modernité. Merci Nadia !',
                status: 'active'
            }
        ]);

        console.log('✅ Avis créés');

        // ========== CRÉATION DES TRANSACTIONS ==========
        // ========== CRÉATION DES TRANSACTIONS (avec transactionNumber manuel) ==========
console.log('💰 Création des transactions...');

// Générer les numéros de transaction manuellement
const now = new Date();
const year = now.getFullYear();
const month = (now.getMonth() + 1).toString().padStart(2, '0');
const day = now.getDate().toString().padStart(2, '0');
const dateStr = `${year}${month}${day}`;

await Transaction.create([
    {
        transactionNumber: `TRX-${dateStr}-0001`,
        userId: client1._id,
        type: 'deposit',
        amount: 500,
        balanceBefore: 1000,
        balanceAfter: 1500,
        status: 'completed',
        description: 'Recharge de portefeuille',
        paymentMethod: 'card',
        completedAt: new Date()
    },
    {
        transactionNumber: `TRX-${dateStr}-0002`,
        userId: freelancer1._id,
        type: 'commission',
        amount: 315,
        balanceBefore: 2185,
        balanceAfter: 2500,
        status: 'completed',
        description: 'Gain pour la commande HIR-2025-0001',
        orderId: orders[0]._id,
        completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    }
]);

console.log('✅ Transactions créées');
        // ========== AFFICHAGE DU RÉSUMÉ ==========
        console.log('\n🎉 SEED TERMINÉ AVEC SUCCÈS ! 🎉');
        console.log('\n📊 RÉSUMÉ :');
        console.log(`👥 Utilisateurs : ${await User.countDocuments()}`);
        console.log(`📦 Services : ${await Service.countDocuments()}`);
        console.log(`📝 Commandes : ${await Order.countDocuments()}`);
        console.log(`⭐ Avis : ${await Review.countDocuments()}`);
        console.log(`💰 Transactions : ${await Transaction.countDocuments()}`);

        console.log('\n🔑 COMPTES DE TEST :');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👑 ADMIN :');
        console.log('   Email: admin@hirafi.com');
        console.log('   Mot de passe: admin123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👤 CLIENTS :');
        console.log('   Email: ahmed@example.com | Mot de passe: 12345678');
        console.log('   Email: fatima@example.com | Mot de passe: 12345678');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('💼 FREELANCERS :');
        console.log('   Email: yassine@example.com | Mot de passe: 12345678 | Design Graphique');
        console.log('   Email: sara@example.com | Mot de passe: 12345678 | Développement Web');
        console.log('   Email: karim@example.com | Mot de passe: 12345678 | Marketing');
        console.log('   Email: nadia@example.com | Mot de passe: 12345678 | Calligraphie');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors du seed:', error);
        process.exit(1);
    }
};

seedData();