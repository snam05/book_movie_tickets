// Quick script to delete all old activities and test fresh logs
import { sequelize } from './db.config.js';
import Activity from './models/Activity.model.js';

async function cleanLogs() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database');
        
        // Delete all activities
        const deleted = await Activity.destroy({
            where: {},
            truncate: true
        });
        
        console.log(`✅ Deleted ${deleted} old activities`);
        console.log('Database is now clean. Make fresh requests to test activity logging.');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

cleanLogs();
