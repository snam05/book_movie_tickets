// scripts/migration-update-showtime-status.js
// Run this script to update the showtime status ENUM values in the database

import sequelize from '../db.config.js';

const runMigration = async () => {
    try {
        console.log('Starting migration: Update Showtime status ENUM values...');
        
        // Execute raw SQL to update the ENUM
        await sequelize.query(`
            ALTER TABLE showtimes 
            MODIFY COLUMN status ENUM('active', 'cancelled') DEFAULT 'active'
        `);
        
        console.log('✓ ENUM values updated successfully');
        
        // Update existing records
        await sequelize.query(`
            UPDATE showtimes SET status = 'active' WHERE status = 'normal'
        `);
        
        const result1 = await sequelize.query(`
            SELECT COUNT(*) as count FROM showtimes WHERE status = 'active'
        `);
        console.log(`✓ Updated 'normal' records to 'active': ${result1[0][0]?.count || 0}`);
        
        // This line won't find anything if migration is fresh, but keeping for safety
        const result2 = await sequelize.query(`
            SELECT COUNT(*) as count FROM showtimes WHERE status = 'cancelled'
        `);
        console.log(`✓ Verified 'cancelled' records: ${result2[0][0]?.count || 0}`);
        
        console.log('\n✓ Migration completed successfully!');
        process.exit(0);
        
    } catch (error) {
        console.error('✗ Migration failed:', error.message);
        process.exit(1);
    }
};

runMigration();
