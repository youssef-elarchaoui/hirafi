// server/testUser.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// Fonction pour tester la création d'utilisateurs
async function testUserModel() {
    try {
        // Connexion à la base de données
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connecté à la base de données');

        // Création d'un client
        const newClient = new User({
            name: 'Ahmed Client',
            email: 'ahmed@example.com',
            password: '12345678',
            role: 'client',
            phone: '0612345678',
            city: 'Casablanca'
        });

        await newClient.save();
        console.log('✅ Client créé :', newClient.name);

        // Création d'un freelancer
        const newFreelancer = new User({
            name: 'Saïd Freelancer',
            email: 'said@example.com',
            password: '12345678',
            role: 'freelancer',
            skills: ['React.js', 'Node.js', 'MongoDB'],
            hourlyRate: 150,
            city: 'Rabat'
        });

        await newFreelancer.save();
        console.log('✅ Freelancer créé :', newFreelancer.name);

        // Création d'un admin
        const newAdmin = new User({
            name: 'Admin Plateforme',
            email: 'admin@hirafi.com',
            password: 'admin123456',
            role: 'admin',
            isVerified: true
        });

        await newAdmin.save();
        console.log('✅ Admin créé :', newAdmin.name);

        // Récupération de tous les utilisateurs
        const allUsers = await User.find({});
        console.log('✅ Nombre total d\'utilisateurs :', allUsers.length);

        // Test de comparaison de mot de passe
        const testUser = await User.findOne({ email: 'ahmed@example.com' }).select('+password');
        if (testUser) {
            const isMatch = await testUser.comparePassword('12345678');
            console.log('✅ Test mot de passe :', isMatch ? 'Correct' : 'Incorrect');
        }

        console.log('\n🎉 Tout fonctionne parfaitement !');

    } catch (error) {
        console.error('❌ Erreur :', error.message);
    } finally {
        // Fermeture de la connexion
        await mongoose.disconnect();
        console.log('🔌 Déconnecté de la base de données');
    }
}

// Exécution du test
testUserModel();